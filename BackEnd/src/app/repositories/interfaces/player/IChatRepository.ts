import { Chat } from "../../../../domain/entities/Chat"; 

export interface IChatRepository {
    findChatsForUser(id: string): Promise<Chat | null>;
    create(teamId: string): Promise<Chat>;
}
