import { IChatRepository } from "../../../app/repositories/interfaces/player/IChatRepository";
import { Chat } from "../../../domain/entities/Chat";
import { ChatModel } from "../../databases/mongo/models/ChatModel";



export class ChatRepository implements IChatRepository {
    async create(teamId: string): Promise<Chat> {
        const chatDoc = new ChatModel({ teamId });
        const saved = await chatDoc.save();

        return {
            id: saved._id.toString(),
            teamId: saved.teamId.toString(),
            createdAt: saved.createdAt,
        };
    }

    async findChatsForUser(teamId: string): Promise<Chat | null> {
        const doc = await ChatModel.findOne({ teamId }).exec();
        if (!doc) return null;

        return {
            id: doc._id.toString(),
            teamId: doc.teamId.toString(),
            createdAt: doc.createdAt,
        };
    }
}
