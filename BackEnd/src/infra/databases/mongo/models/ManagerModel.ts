import { Schema, model, Types, Document } from "mongoose";

export interface ManagerDocument extends Document {
    _id : Types.ObjectId;
    userId: Types.ObjectId;
    wallet: number;
    tournamentsCreated: Types.ObjectId[];
    tournamentsParticipated: Types.ObjectId[];
    teams: Types.ObjectId[];
}

const ManagerSchema = new Schema<ManagerDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    wallet: { type: Number, default: 0 },
    tournamentsCreated: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    tournamentsParticipated: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
},
    { timestamps: true }
);

export const ManagerModel = model<ManagerDocument>("Manager", ManagerSchema);