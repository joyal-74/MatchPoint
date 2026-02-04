import { IChatRepository } from "../../../app/repositories/interfaces/player/IChatRepository.js";
import { Chat } from "../../../domain/entities/Chat.js";
import { ChatModel } from "../../databases/mongo/models/ChatModel.js";



export class ChatRepositoryMongo implements IChatRepository {
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
