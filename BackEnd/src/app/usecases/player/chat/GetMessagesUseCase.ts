import { IMessageRepository } from "app/repositories/interfaces/player/IMessageRepository";

export class GetMessagesUseCase {
    constructor(private messageRepo: IMessageRepository) {}

    async execute(chatId: string) {
        return this.messageRepo.findByChatId(chatId);
    }
}