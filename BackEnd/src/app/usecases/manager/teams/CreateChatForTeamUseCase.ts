import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IChatRepository } from "../../../repositories/interfaces/player/IChatRepository.js";
import { ICreateChatForTeamUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";


@injectable()
export class CreateChatForTeamUseCase implements ICreateChatForTeamUseCase {
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
