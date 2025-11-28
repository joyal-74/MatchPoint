import { Server, Socket } from "socket.io";
import http from "http";
import { Types } from "mongoose";
import { MessageModel } from "infra/databases/mongo/models/MessageModel";
import { authenticateSocket } from "presentation/express/middlewares/socketAuth";

export interface AuthenticatedSocket extends Socket {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profileImage: string
    }
}

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: { origin: "*" },
    });

    // Use auth middleware
    io.use((socket, next) => authenticateSocket(socket as AuthenticatedSocket, next));

    io.on("connection", (socket: Socket) => {
        // Assert socket as AuthenticatedSocket
        const authSocket = socket as AuthenticatedSocket;

        console.log(
            `🔌 Socket Connected: ${authSocket.id} | User: ${authSocket.user.firstName} ${authSocket.user.lastName}`
        );

        let currentChatId: string | null = null;

        // Join room
        authSocket.on("join-room", ({ chatId }: { chatId: string }) => {
            if (currentChatId) authSocket.leave(currentChatId);
            authSocket.join(chatId);
            currentChatId = chatId;

            console.log(`👤 ${authSocket.user.firstName} joined room ${chatId}`);
        });

        // Send message
        authSocket.on("send-message", async ({ chatId, text, clientId, profileImage }: { chatId: string; text: string; clientId: string; profileImage?: string }) => {
            try {
                const savedMessage = await MessageModel.create({
                    chatId: new Types.ObjectId(chatId),
                    senderId: new Types.ObjectId(authSocket.user._id),
                    text,
                    status: "sent",
                    clientId,
                });

                const messageToSend = {
                    id: (savedMessage._id as Types.ObjectId).toString(),
                    chatId,
                    senderId: authSocket.user._id,
                    senderName: `${authSocket.user.firstName} ${authSocket.user.lastName}`,
                    text,
                    createdAt: savedMessage.createdAt,
                    status: "sent" as const,
                    clientId,
                    profileImage: profileImage || ""
                };

                io.to(chatId).emit("receive-message", messageToSend);
            } catch (err) {
                console.error(err);
                authSocket.emit("message-error", {
                    clientId,
                    error: "Failed to send message",
                });
            }
        });

        // Typing event
        authSocket.on("typing", ({ chatId, typing }: { chatId: string; typing: boolean }) => {
            authSocket.to(chatId).emit("typing", {
                user: {
                    id: authSocket.user._id,
                    name: `${authSocket.user.firstName} ${authSocket.user.lastName}`,
                },
                typing,
            });
        });

        // Handle disconnect
        authSocket.on("disconnect", () => {
            if (currentChatId) {
                io.to(currentChatId).emit("typing", {
                    user: {
                        id: authSocket.user._id,
                        name: `${authSocket.user.firstName} ${authSocket.user.lastName}`,
                    },
                    typing: false,
                });
            }

            console.log(`❌ User disconnected: ${authSocket.user.firstName}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
