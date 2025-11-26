import { IMessageRepository } from 'app/repositories/interfaces/player/IMessageRepository';
import { MessageModel } from 'infra/databases/mongo/models/MessageModel';
import { MessageMapper } from 'infra/utils/mappers/MessageMapper';
import { Message } from 'domain/entities/Message';
import { CreateMessageDTO } from 'domain/dtos/CreateMessageDTO';


export class MessageRepositoryMongo implements IMessageRepository {
    async create(data: CreateMessageDTO): Promise<Message> {
        const doc = await MessageModel.create({
            chatId: data.chatId,
            senderId: data.senderId,
            text: data.text,
        });

        return MessageMapper.fromHydrated(doc);
    }

    async findByChatId(chatId: string, page = 1, pageSize = 20): Promise<Message[]> {
        const skip = (page - 1) * pageSize;

        const rawDocs = await MessageModel.find({ chatId })
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip)
            .populate({ path: 'senderId', select: 'firstName lastName profileImage' })
            .lean();

        return rawDocs.reverse().map(MessageMapper.fromLean);
    }


    async updateStatus(messageId: string, status: Message['status']): Promise<void> {
        await MessageModel.updateOne({ _id: messageId }, { status });
    }

    async findByClientId(clientId: string): Promise<Message | null> {
        const doc = await MessageModel.findOne({ clientId })
            .populate({ path: 'senderId', select: 'firstName lastName' })
            .lean();

        return doc ? MessageMapper.fromLean(doc) : null;
    }
}
