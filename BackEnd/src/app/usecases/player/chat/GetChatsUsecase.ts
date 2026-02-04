import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IChatRepository } from "../../../repositories/interfaces/player/IChatRepository.js";


@injectable()
export class GetChatsUseCase {
    constructor(
        @inject(DI_TOKENS.ChatRepository) private _chatRepo: IChatRepository
    ) { }

    async execute(userId: string) {
        return this._chatRepo.findChatsForUser(userId);
    }
}
