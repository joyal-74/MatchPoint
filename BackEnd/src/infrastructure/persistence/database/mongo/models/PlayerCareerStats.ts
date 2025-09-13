import { Schema, model, Types, Document } from "mongoose";

interface Stat {
    key: string;
    label: string;
    value: number;
}

interface PlayerCareerStatsDocument extends Document {
    playerId: Types.ObjectId;
    stats: Record<string, Stat[]>;
}

const StatSchema = new Schema<Stat>({
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Number, default: 0 }
});

const PlayerCareerStatsSchema = new Schema<PlayerCareerStatsDocument>({
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true, unique: true },
    stats: { type: Map, of: [StatSchema], default: {} }
}, { timestamps: true });

export const PlayerCareerStatsModel = model<PlayerCareerStatsDocument>("PlayerCareerStats", PlayerCareerStatsSchema);