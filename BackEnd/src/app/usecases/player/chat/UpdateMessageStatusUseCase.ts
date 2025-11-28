import { IMessageRepository } from "app/repositories/interfaces/player/IMessageRepository";
import { Message } from "domain/entities/Message";

export class UpdateMessageStatusUseCase {
    constructor(private messageRepo: IMessageRepository) { }

    async execute(messageId: string, status: Message['status']): Promise<void> {
        await this.messageRepo.updateStatus(messageId, status);
    }
}
