import { Server } from "socket.io";
import { Types } from "mongoose";
import { AuthenticatedSocket } from "../SocketServer.js"; 
import { MessageModel } from "../../../infra/databases/mongo/models/MessageModel.js";

export class ChatHandler {
    constructor(
        private io: Server, 
        private socket: AuthenticatedSocket
    ) {
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on("join-room", this.joinRoom.bind(this));
        this.socket.on("send-message", this.sendMessage.bind(this));
        this.socket.on("typing", this.typing.bind(this));
    }

    private joinRoom({ chatId }: { chatId: string }) {
        this.socket.join(chatId);
    }

    private async sendMessage(data: { chatId: string; text: string; clientId: string; profileImage?: string }) {
        const { chatId, text, clientId, profileImage } = data;
        try {
            // REFACTOR NOTE: In strict clean arch, inject an ISaveMessageUseCase here
            const savedMessage = await MessageModel.create({
                chatId: new Types.ObjectId(chatId),
                senderId: new Types.ObjectId(this.socket.user._id),
                text,
                status: "sent",
                clientId,
            });

            const messageToSend = {
                id: (savedMessage._id as Types.ObjectId).toString(),
                chatId,
                senderId: this.socket.user._id,
                senderName: `${this.socket.user.firstName} ${this.socket.user.lastName}`,
                text,
                createdAt: savedMessage.createdAt,
                status: "sent" as const,
                clientId,
                profileImage: profileImage || ""
            };

            this.io.to(chatId).emit("receive-message", messageToSend);
        } catch (err) {
            console.error(err);
            this.socket.emit("message-error", { clientId, error: "Failed to send message" });
        }
    }

    private typing({ chatId, typing }: { chatId: string; typing: boolean }) {
        this.socket.to(chatId).emit("typing", {
            user: { id: this.socket.user._id, name: `${this.socket.user.firstName} ${this.socket.user.lastName}` },
            typing
        });
    }
}
