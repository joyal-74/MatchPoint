import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";

import { IMessageRepository } from "../../../../app/repositories/interfaces/player/IMessageRepository";
import { Message } from "../../../../domain/entities/Message";

@injectable()
export class UpdateMessageStatusUseCase {
    constructor(
        @inject(DI_TOKENS.MessageRepository) private messageRepo: IMessageRepository
    ) { }

    async execute(messageId: string, status: Message['status']): Promise<void> {
        await this.messageRepo.updateStatus(messageId, status);
    }
}
