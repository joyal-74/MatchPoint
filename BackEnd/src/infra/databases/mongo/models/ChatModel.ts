import { Schema, model, Types } from "mongoose";

export interface ChatModelType {
    teamId: Types.ObjectId;
    createdAt: Date;
}

const chatSchema = new Schema<ChatModelType>({
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    createdAt: { type: Date, default: Date.now },
});

export const ChatModel = model<ChatModelType>("Chat", chatSchema);
