import { IChatRepository } from "app/repositories/interfaces/player/IChatRepository";

export class GetChatsUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(userId: string) {
        return this.chatRepo.findChatsForUser(userId);
    }
}