import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMessageRepository } from "app/repositories/interfaces/player/IMessageRepository";

@injectable()
export class GetMessagesUseCase {
    constructor(
        @inject(DI_TOKENS.MessageRepository) private _messageRepo: IMessageRepository
    ) {}

    async execute(chatId: string) {
        return this._messageRepo.findByChatId(chatId);
    }
}