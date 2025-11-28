import { IChatRepository } from "app/repositories/interfaces/player/IChatRepository";

export class CreateChatForTeamUseCase {
    constructor(
        private _chatRepo: IChatRepository
    ) { }

    async execute(teamId: string) {
        const existingChat = await this._chatRepo.findChatsForUser(teamId);
        if (existingChat) return existingChat;

        const newChat = await this._chatRepo.create(teamId,);

        return newChat;
    }
}
