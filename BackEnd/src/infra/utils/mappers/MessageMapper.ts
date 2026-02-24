import { Message } from "../../../domain/entities/Message.js";
import { IMessage } from "../../../infra/databases/mongo/models/MessageModel.js";
import { FlattenMaps, HydratedDocument, Types } from "mongoose";

type PopulatedSender = {
    _id: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
} | Types.ObjectId | string | undefined;

export type LeanMessage = FlattenMaps<IMessage> & {
    senderId?: PopulatedSender;
};

export class MessageMapper {

    static toPersistence(m: Omit<Message, "id" | "createdAt">) {
        return {
            chatId: m.chatId,
            senderId: m.senderId,
            text: m.text,
            status: m.status,
            receiverId: m.receiverId,
            clientId: m.clientId,
            replyTo: m.replyTo
        };
    }

    static fromHydrated(doc: HydratedDocument<IMessage>): Message {
        const sender: PopulatedSender = doc.senderId;

        let senderId = "";
        let senderName = "Unknown";
        let profileImage = "";

        if (sender instanceof Types.ObjectId) {
            senderId = sender.toString();
        } else if (typeof sender === "string") {
            senderId = sender;
        } else if (sender && "_id" in sender) {
            senderId = sender._id.toString();
            const firstName = sender.firstName ?? "";
            const lastName = sender.lastName ?? "";
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "Unknown";
            profileImage = sender.profileImage ?? "";
        }

        return {
            id: (doc._id as Types.ObjectId).toString(),
            chatId: doc.chatId.toString(),
            senderId,
            senderName,
            profileImage,
            text: doc.text,
            status: doc.status,
            createdAt: doc.createdAt,
            receiverId: doc.receiverId?.toString(),
            clientId: doc.clientId,
            replyTo: doc.replyTo
        };
    }

    static fromLean(doc: LeanMessage): Message {
        const sender: PopulatedSender = doc.senderId;

        let senderId = "";
        let senderName = "Unknown";
        let profileImage = "";

        if (sender instanceof Types.ObjectId) {
            senderId = sender.toString();
        } else if (typeof sender === "string") {
            senderId = sender;
        } else if (sender && "_id" in sender) {
            senderId = sender._id.toString();
            const firstName = sender.firstName ?? "";
            const lastName = sender.lastName ?? "";
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "Unknown";
            profileImage = sender.profileImage ?? "";
        }

        return {
            id: (doc._id as Types.ObjectId).toString(),
            chatId: doc.chatId.toString(),
            senderId,
            senderName,
            profileImage,
            text: doc.text,
            status: doc.status,
            createdAt: doc.createdAt,
            receiverId: doc.receiverId?.toString(),
            clientId: doc.clientId,
            replyTo: doc.replyTo
        };
    }
}
