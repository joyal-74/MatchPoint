import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IMessageRepository } from "../../../repositories/interfaces/player/IMessageRepository";
import { IChatRepository } from "../../../repositories/interfaces/player/IChatRepository";
import { SocketServer } from "../../../../presentation/socket/SocketServer";
import { NotFoundError } from "../../../../domain/errors/index";



interface SendMessageDTO {
    chatId: string;
    senderId: string;
    senderRole: string;
    text: string;
}

@injectable()
export class SendMessageUseCase {
    constructor(
        @inject(DI_TOKENS.MessageRepository) private messageRepo: IMessageRepository,
        @inject(DI_TOKENS.ChatRepository) private _chatRepo: IChatRepository,
        private socketServer: SocketServer
    ) { }

    async execute(data: SendMessageDTO) {
        const chat = await this._chatRepo.findChatsForUser(data.chatId);

        if (!chat) throw new NotFoundError("Chat not found");

        const newMsg = await this.messageRepo.create({
            chatId: data.chatId,
            senderId: data.senderId,
            text: data.text,
            clientId : data.senderId,
            senderRole : data.senderRole
        });

        const io = this.socketServer.getIO();
        io.to(data.chatId).emit("receive-message", newMsg);

        return newMsg;
    }
}
