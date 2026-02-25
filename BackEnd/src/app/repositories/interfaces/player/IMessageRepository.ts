import { CreateMessageDTO } from '../../../../domain/dtos/CreateMessageDTO';
import { Message } from '../../../../domain/entities/Message';

export interface IMessageRepository {
    create(data: CreateMessageDTO): Promise<Message>;
    findByChatId(chatId: string, page?: number, pageSize?: number): Promise<Message[]>;
    updateStatus(messageId: string, status: Message['status']): Promise<void>;
    findByClientId(clientId: string): Promise<Message | null>;
}
