import { Types, HydratedDocument } from "mongoose";
import { Chat } from "domain/entities/Chat";
import { ChatModelType } from "infra/databases/mongo/models/ChatModel";

export class ChatMapper {

    static toDomain(doc: HydratedDocument<ChatModelType> | null): Chat | null {
        if (!doc) return null;

        return {
            id: doc._id.toString(),
            teamId: doc.teamId.toString(),
            createdAt: doc.createdAt,
        };
    }

    static toPersistence(data: { teamId: string;}) {
        return {
            teamId: new Types.ObjectId(data.teamId),
            createdAt: new Date(),
        };
    }
}
