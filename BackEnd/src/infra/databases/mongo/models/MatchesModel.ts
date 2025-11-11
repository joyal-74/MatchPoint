import { model, Schema } from "mongoose";

const matchesSchema = new Schema({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    teamA: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamB: { type: Schema.Types.ObjectId, ref: "Team" },
    round: Number, 
    date: String,
    teamLogoA: { type: String, default: "" },
    teamLogoB: { type: String, default: "" },
    matchNumber: { type: String, default: "" },
    venue: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", 'ongoing', "completed", "bye"], default: "upcoming" },
    winner: { type: String, default: '' },
    stats: { type: Map, of: Schema.Types.Mixed, default: {} },
});

export default model("Matches", matchesSchema);