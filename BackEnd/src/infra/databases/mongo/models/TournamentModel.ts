import { Schema, model, Document, Types } from "mongoose";
import { Tournament } from "domain/entities/Tournaments";

export interface TournamentDocument extends Omit<Tournament, "_id">, Document {
    _id: Types.ObjectId,
    isDeleted: boolean
}

const TournamentSchema = new Schema<TournamentDocument>(
    {
        tourId: { type: String, required: true },
        name: { type: String, required: true },
        sport: { type: String, required: true },
        description: { type: String },
        maxTeams: { type: Number, required: true },
        prizePool: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        managerId: { type: String, required: true },
        location: { type: String },
        status: { type: String, enum: ["upcoming", "ongoing", "ended"], default: "upcoming" },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const TournamentModel = model<TournamentDocument>("Tournament", TournamentSchema);
