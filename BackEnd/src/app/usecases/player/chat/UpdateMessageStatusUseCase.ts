import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";

import { IMessageRepository } from "../../../../app/repositories/interfaces/player/IMessageRepository.js";
import { Message } from "../../../../domain/entities/Message.js";

@injectable()
export class UpdateMessageStatusUseCase {
    constructor(
        @inject(DI_TOKENS.MessageRepository) private messageRepo: IMessageRepository
    ) { }

    async execute(messageId: string, status: Message['status']): Promise<void> {
        await this.messageRepo.updateStatus(messageId, status);
    }
}
