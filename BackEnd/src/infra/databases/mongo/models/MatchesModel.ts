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

    // --- WINNER & RESULT FIELDS (ADDED) ---
    winner: { type: Schema.Types.ObjectId, ref: "Team", default: null, required: false },
    resultType: { type: String, enum: ['WIN', 'TIE', 'DRAW', 'NO_RESULT', null], default: null },
    resultDescription: { type: String, default: "" },
    winMargin: { type: String, default: null },
    winType: { type: String, enum: ['runs', 'wickets', null], default: null },

    stats: { type: Map, of: Schema.Types.Mixed, default: {} },
    tossWinner: { type: Schema.Types.ObjectId, ref: "Team" },
    tossDecision: { type: String, enum: ["Batting", "Bowling"] },
    oversLimit: { type: Number, default: 20 },
    umpire: { type: Schema.Types.ObjectId, ref: "User", default: null, required: false },

    endInfo: {
        type: { type: String, enum: ["NORMAL", "ABANDONED", "NO_RESULT"], default: null },
        reason: { type: String, enum: ["COMPLETED", "RAIN", "BAD_LIGHT", "FORCE_END", "OTHER"], required: false },
        notes: { type: String, default: "" },
        endedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, required: false },
        endedAt: { type: Date, default: null }
    },

    // Stream Info
    streamTitle: { type: String, default: "" },
    streamDescription: { type: String, default: "" },
    isStreamLive: { type: Boolean, default: false },
    streamStartedAt: { type: Date },
    streamerId: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default model("Matches", matchesSchema);
