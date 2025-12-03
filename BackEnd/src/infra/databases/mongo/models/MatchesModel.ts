import { model, Schema } from "mongoose";

const matchesSchema = new Schema({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    teamA: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    teamB: { type: Schema.Types.ObjectId, ref: "Team" },
    round: Number,
    date: { type: Date },
    teamLogoA: { type: String, default: "" },
    teamLogoB: { type: String, default: "" },
    matchNumber: { type: String, default: "" },
    venue: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", 'ongoing', "completed", "bye"], default: "upcoming" },
    winner: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    stats: { type: Map, of: Schema.Types.Mixed, default: {} },
    tossWinner: { type: Schema.Types.ObjectId, ref: "Team" },
    tossDecision: { type: String, enum: ["bat", "bowl"] },
    overs: { type: Number, default: 20 },
});

export default model("Matches", matchesSchema);