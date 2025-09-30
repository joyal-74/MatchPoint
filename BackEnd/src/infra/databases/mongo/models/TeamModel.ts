import { Schema, model, Types, Document } from "mongoose";

export interface TeamDocument extends Document {
    _id: Types.ObjectId;
    teamId: string;
    managerId: Types.ObjectId;
    name: string;
    logo: string;
    sport: string;
    description : string;
    maxPlayers : number;
    members: {
        playerId: Types.ObjectId;
        status: "playing" | "sub";
    }[];
    status: boolean;
    created: Date;
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
        type: [
            {
                playerId: { type: Schema.Types.ObjectId, ref: "Player" },
                status: { type: String, enum: ["playing", "sub"], default: "sub" }
            }
        ],
        default: []
    },
    status: { type: Boolean, default: true },
    created: { type: Date, default: Date.now }
});

export const TeamModel = model<TeamDocument>("Team", TeamSchema);