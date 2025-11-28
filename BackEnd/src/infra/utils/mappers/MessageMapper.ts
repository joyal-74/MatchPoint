import { Message } from 'domain/entities/Message';
import { IMessage } from 'infra/databases/mongo/models/MessageModel';
import { HydratedDocument, Types } from 'mongoose';

// Define a type for populated sender
type PopulatedSender = {
    _id: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
} | Types.ObjectId | string | undefined;

export class MessageMapper {

    static toPersistence(m: Omit<Message, 'id' | 'createdAt'>) {
        return {
            chatId: m.chatId,
            senderId: m.senderId,
            text: m.text,
            status: m.status,
            receiverId: m.receiverId,
            clientId: m.clientId,
        };
    }

    static fromHydrated(doc: HydratedDocument<IMessage>): Message {
        const sender: PopulatedSender = doc.senderId;

        let senderId: string;
        let senderName: string;
        let profileImage: string;


        if (sender instanceof Types.ObjectId) {
            senderId = sender.toString();
            senderName = 'Unknown';
            profileImage = '';
        } else if (typeof sender === 'string') {
            senderId = sender;
            senderName = 'Unknown';
            profileImage = '';
        } else if (sender && '_id' in sender) {
            senderId = sender._id.toString();
            const firstName = sender.firstName ?? '';
            const lastName = sender.lastName ?? '';
            
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
            profileImage = sender.profileImage ?? '';
        } else {
            senderId = '';
            senderName = 'Unknown';
            profileImage = '';
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
        };
    }

    static fromLean(doc: IMessage & { senderId?: PopulatedSender }): Message {
        const sender: PopulatedSender = doc.senderId;

        let senderId: string;
        let senderName: string;
        let profileImage: string;

        if (sender instanceof Types.ObjectId) {
            senderId = sender.toString();
            senderName = 'Unknown';
            profileImage = '';
        } else if (typeof sender === 'string') {
            senderId = sender;
            senderName = 'Unknown';
            profileImage = '';
        } else if (sender && '_id' in sender) {
            senderId = sender._id.toString();
            const firstName = sender.firstName ?? '';
            const lastName = sender.lastName ?? '';
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
            profileImage = sender.profileImage ?? '';
        } else {
            senderId = '';
            senderName = 'Unknown';
            profileImage = '';
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
        };
    }
}
