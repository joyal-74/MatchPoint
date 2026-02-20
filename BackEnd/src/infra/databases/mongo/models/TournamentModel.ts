import { Schema, model, Document, Types } from "mongoose";
import { Tournament } from "../../../../domain/entities/Tournaments.js";

interface CanceledInfo {
    isCanceled: boolean;
    reason: string | null;
    canceledAt: Date | null;
}

export interface TournamentDocument extends Omit<Tournament, "_id" | "managerId">, Document {
    _id: Types.ObjectId,
    managerId: Types.ObjectId,
    umpireId: Types.ObjectId,
    canceled: CanceledInfo
}

const TournamentSchema = new Schema<TournamentDocument>(
    {
        tourId: { type: String, required: true },
        managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        umpireId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        title: { type: String, required: true },
        description: { type: String },
        sport: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        regDeadline: { type: Date, required: true },
        location: { type: String },
        banner: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        maxTeams: { type: Number, required: true },
        minTeams: { type: Number, required: true },
        currTeams: { type: Number, default: 0 },
        entryFee: { type: String, required: true },
        prizePool: { type: Number, required: true },
        playersPerTeam: { type: Number, required: true },
        format: { type: String, enum: ['knockout', 'friendly', 'league'], default: 'friendly' },
        status: { type: String, enum: ["upcoming", "ongoing", "ended", 'cancelled'], default: "upcoming" },
        isBlocked : { type: Boolean, default: false },
        canceled: {
            isCanceled: { type: Boolean, default: false },
            reason: { type: String, default: null },
            canceledAt: { type: Date, default: null }
        },
        rules: { type: [String], default: [] }
    },
    { timestamps: true, }
);

export const TournamentModel = model<TournamentDocument>("Tournament", TournamentSchema);
