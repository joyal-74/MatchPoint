import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IChatRepository } from "app/repositories/interfaces/player/IChatRepository";
import { IMessageRepository } from "app/repositories/interfaces/player/IMessageRepository";
import { NotFoundError } from "domain/errors";
import { getIO } from "presentation/composition/socketConfig";


interface SendMessageDTO {
    chatId: string;
    senderId: string;
    text: string;
}

@injectable()
export class SendMessageUseCase {
    constructor(
        @inject(DI_TOKENS.MessageRepository) private messageRepo: IMessageRepository,
        @inject(DI_TOKENS.Logger) private _chatRepo: IChatRepository
    ) { }

    async execute(data: SendMessageDTO) {
        const chat = await this._chatRepo.findChatsForUser(data.chatId);
        console.log(data.chatId, "kjsdfh")

        if (!chat) throw new NotFoundError("Chat not found");

        const newMsg = await this.messageRepo.create({
            chatId: data.chatId,
            senderId: data.senderId,
            text: data.text
        });

        const io = getIO();
        io.to(data.chatId).emit("receive-message", newMsg);

        return newMsg;
    }
}