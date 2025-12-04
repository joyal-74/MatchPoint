import { Schema, model, Types, Document } from "mongoose";

export interface BatsmanStat {
    playerId: Types.ObjectId;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    out: boolean;
    dismissalType?: string;
    fielderId?: Types.ObjectId;
}

export interface BowlerStat {
    playerId: Types.ObjectId;
    overs: number;
    balls: number;
    runsConceded: number;
    wickets: number;
}

export interface Innings {
    battingTeam: Types.ObjectId;
    bowlingTeam: Types.ObjectId;

    runs: number;
    wickets: number;
    balls: number;

    currentStriker: Types.ObjectId | null;
    currentNonStriker: Types.ObjectId | null;
    currentBowler: Types.ObjectId | null;

    batsmen: BatsmanStat[];
    bowlers: BowlerStat[];
}

export interface TournamentMatchStatsDocument extends Document {
    tournamentId: Types.ObjectId;
    matchId: Types.ObjectId;

    innings1: Innings;
    innings2: Innings | null;

    currentInnings: number; // 1 or 2
    isLive: boolean;
}

const BatsmanSchema = new Schema<BatsmanStat>({
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    out: { type: Boolean, default: false },
    dismissalType: String,
    fielderId: { type: Schema.Types.ObjectId, ref: "Player" }
});

const BowlerSchema = new Schema<BowlerStat>({
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 }
});

const InningsSchema = new Schema<Innings>({
    battingTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    bowlingTeam: { type: Schema.Types.ObjectId, ref: "Team" },

    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },

    currentStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    currentNonStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    currentBowler: { type: Schema.Types.ObjectId, ref: "Player", default: null },

    batsmen: [BatsmanSchema],
    bowlers: [BowlerSchema]
});

const TournamentMatchStatsSchema = new Schema<TournamentMatchStatsDocument>({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    matchId: { type: Schema.Types.ObjectId, ref: "Matches", required: true },

    innings1: { type: InningsSchema, required: true },
    innings2: {
        type: InningsSchema,
        default: () => ({
            battingTeam: null,
            bowlingTeam: null,
            runs: 0,
            wickets: 0,
            balls: 0,
            currentStriker: null,
            currentNonStriker: null,
            currentBowler: null,
            batsmen: [],
            bowlers: []
        })
    },

    currentInnings: { type: Number, default: 1 },
    isLive: { type: Boolean, default: true }

}, { timestamps: true });

export const TournamentMatchStatsModel = model<TournamentMatchStatsDocument>(
    "TournamentMatchStatsModel",
    TournamentMatchStatsSchema
);