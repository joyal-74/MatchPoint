import { Schema, model, Types, Document } from "mongoose";

interface PlayerDocument extends Document {
    userId: Types.ObjectId;
    sport: string;
    profile: { key: string; label: string; type: string };
    career_stats: { key: string; type: string; label: string }[];
    tournaments: { tournament_id: Types.ObjectId; key: string; type: string; label: string }[];
}

const ProfileSchema = new Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
});

const PlayerSchema = new Schema<PlayerDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    sport: { type: String, required: true },
    profile: { type: [ProfileSchema], required: true }
}, { timestamps: true });

export const PlayerModel = model<PlayerDocument>("Player", PlayerSchema);