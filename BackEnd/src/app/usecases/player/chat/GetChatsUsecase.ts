import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IChatRepository } from "app/repositories/interfaces/player/IChatRepository";

@injectable()
export class GetChatsUseCase {
    constructor(
        @inject(DI_TOKENS.ChatRepository) private _chatRepo: IChatRepository
    ) { }

    async execute(userId: string) {
        return this._chatRepo.findChatsForUser(userId);
    }
}