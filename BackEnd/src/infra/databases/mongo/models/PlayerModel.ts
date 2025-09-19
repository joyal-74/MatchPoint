import { Schema, model, Types, Document } from "mongoose";

export interface PlayerDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    sport: string;
    profile: Map<string, any>;
    stats: Map<string, any>;
}

const PlayerSchema = new Schema<PlayerDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    sport: { type: String, required: true },
    profile: { type: Map, of: Schema.Types.Mixed, default: {} },
    stats: { type: Map, of: Schema.Types.Mixed, default: {} },
}, { timestamps: true });


export const PlayerModel = model<PlayerDocument>("Player", PlayerSchema);