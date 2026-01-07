import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IChatRepository } from "app/repositories/interfaces/player/IChatRepository";

@injectable()
export class CreateChatForTeamUseCase {
    constructor(
        @inject(DI_TOKENS.ChatRepository) private _chatRepo: IChatRepository
    ) { }

    async execute(teamId: string) {
        const existingChat = await this._chatRepo.findChatsForUser(teamId);
        if (existingChat) return existingChat;

        const newChat = await this._chatRepo.create(teamId,);

        return newChat;
    }
}
