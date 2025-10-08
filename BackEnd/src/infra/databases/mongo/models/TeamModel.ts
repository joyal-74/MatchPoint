import { Schema, model, Types, Document } from "mongoose";
import { PhaseStatus, playerStatus, statsType, TeamStatus } from "../types/Team";
import { PlayerApprovalStatus } from "domain/dtos/Team.dto";

export interface TeamDocument extends Document {
    _id: Types.ObjectId;
    teamId: string;
    managerId: Types.ObjectId;
    name: string;
    logo: string;
    sport: string;
    description: string;
    maxPlayers: number;
    members: {
        playerId: Types.ObjectId;
        userId: Types.ObjectId;
        status: playerStatus;
        approvalStatus: PlayerApprovalStatus;
    }[];
    state: string;
    city: string;
    stats: statsType;
    status: TeamStatus;
    phase: PhaseStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema = new Schema<TeamDocument>({
    teamId: { type: String, required: true, unique: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    sport: { type: String, required: true },
    description: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
    members: {
        type: [{
            playerId: { type: Schema.Types.ObjectId, ref: "Player" },
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["playing", "sub"], default: "sub" },
            approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
        }],
        default: []
    },
    state: { type: String, required: true },
    city: { type: String, required: true },

    stats: {
        totalMatches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        winRate: { type: Number, default: 0 },
    },
    phase: {
        type: String,
        enum: ["recruiting", "active", "competing", "inactive"],
        default: "recruiting"
    },
    status: { type: String, enum: ["active", "blocked", "deleted"], default: "active" },

}, { timestamps: true });

export const TeamModel = model<TeamDocument>("Team", TeamSchema);