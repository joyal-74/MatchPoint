import { Server } from "socket.io";
import { Types } from "mongoose";
import { AuthenticatedSocket } from "../SocketServer.js";
import { MessageModel } from "../../../infra/databases/mongo/models/MessageModel.js";
import { TeamModel } from "../../../infra/databases/mongo/models/TeamModel.js";

interface IReplyTo {
    messageId: string;
    text: string;
    senderName: string;
}

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

    private async sendMessage(data: {
        chatId: string;
        text: string;
        clientId: string;
        profileImage?: string;
        replyTo?: IReplyTo;
    }) {
        const { chatId, text, clientId, profileImage, replyTo } = data;
        try {

            console.log("DEBUG: Incoming Socket Data:", JSON.stringify(data, null, 2));

            const userId = this.socket.user._id;

            const team = await TeamModel.findOne({
                _id: chatId,
                "members": {
                    $elemMatch: {
                        userId: new Types.ObjectId(userId),
                        approvalStatus: "approved"
                    }
                }
            });

            if (!team) {
                console.warn(`Unauthorized chat attempt by user ${userId} in team ${chatId}`);

                this.socket.emit("message-error", {
                    clientId,
                    error: "You are no longer a member of this team."
                });

                this.socket.leave(chatId);
                return;
            }

            const savedMessage = await MessageModel.create({
                chatId: new Types.ObjectId(chatId),
                senderId: new Types.ObjectId(this.socket.user._id),
                text,
                status: "sent",
                clientId,
                replyTo: replyTo ? {
                    messageId: replyTo.messageId,
                    text: replyTo.text,
                    senderName: replyTo.senderName
                } : undefined,
            });

            console.log("DEBUG: Saved Document:", savedMessage);

            // 2. Construct the message to broadcast
            const messageToSend = {
                id: (savedMessage._id as Types.ObjectId).toString(),
                chatId,
                senderId: this.socket.user._id,
                senderName: `${this.socket.user.firstName} ${this.socket.user.lastName}`,
                text,
                createdAt: savedMessage.createdAt,
                status: "sent" as const,
                clientId,
                profileImage: profileImage || "",
                replyTo: savedMessage.replyTo
            };


            // 3. Emit to everyone in the room
            this.io.to(chatId).emit("receive-message", messageToSend);

            console.log(`✅ Message ${replyTo ? '(Reply)' : ''} sent in room ${chatId}`);

        } catch (err) {
            console.error("❌ Socket SendMessage Error:", err);
            this.socket.emit("message-error", { clientId, error: "Failed to send message" });
        }
    }

    public kickUserFromTeam(userId: string, teamId: string) {
        this.io.to(userId).emit("removed-from-team", { teamId });

        const userSockets = this.io.sockets.adapter.rooms.get(userId);
        if (userSockets) {
            userSockets.forEach((socketId) => {
                const socket = this.io.sockets.sockets.get(socketId);
                if (socket) {
                    socket.leave(teamId);
                    console.log(`Socket ${socketId} forced to leave team ${teamId}`);
                }
            });
        }
    }

    private typing({ chatId, typing }: { chatId: string; typing: boolean }) {
        this.socket.to(chatId).emit("typing", {
            user: { id: this.socket.user._id, name: `${this.socket.user.firstName} ${this.socket.user.lastName}` },
            typing
        });
    }
}
