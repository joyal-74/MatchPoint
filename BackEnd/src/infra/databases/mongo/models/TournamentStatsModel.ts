import { BatsmanStat, BowlerStat, InningsDTO, TournamentMatchStatsDocument } from "domain/types/match.types";
import { Schema, Types, model } from "mongoose";

interface BatsmanPersist extends Omit<BatsmanStat, 'playerId'> {
    playerId: Types.ObjectId; 
}

interface BowlerPersist extends Omit<BowlerStat, 'playerId'> {
    playerId: Types.ObjectId; 
}

interface TournamentMatchPersist extends Omit<TournamentMatchStatsDocument, 'tournamentId'| 'matchId'> {
    tournamentId: Types.ObjectId; 
    matchId: Types.ObjectId; 
    umpire: string; 
}

interface InningsPersist extends Omit<InningsDTO, 'battingTeam'| 'bowlingTeam'> {
    battingTeam: Types.ObjectId; 
    bowlingTeam: Types.ObjectId; 
}

const BatsmanSchema = new Schema<BatsmanPersist>({
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    out: { type: Boolean, default: false },
    dismissalType: String,
    fielderId: { type: Schema.Types.ObjectId, ref: "Player" },
    retiredHurt: { type: Boolean, default: false },
});

const BowlerSchema = new Schema<BowlerPersist>({
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
});

const ExtraSchema = new Schema({
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
});

const BallLogSchema = new Schema({
    over: Number,
    ballInOver: Number,

    strikerId: { type: Schema.Types.ObjectId, ref: "Player" },
    nonStrikerId: { type: Schema.Types.ObjectId, ref: "Player" },
    bowlerId: { type: Schema.Types.ObjectId, ref: "Player" },

    runs: { type: Number, default: 0 },

    extrasType: {
        type: String,
        enum: ["wide", "noBall", "bye", "legBye", "penalty"]
    },
    extrasRuns: { type: Number, default: 0 },

    isLegalBall: { type: Boolean, default: true },

    dismissal: {
        type: {
            type: String,
            enum: [
                "bowled", "caught", "run-out", "lbw", "stumped", "hit-wicket",
                "retired-hurt", "retired-out", "timed-out", "obstructing-field", "hit-ball-twice"
            ]
        },
        outBatsmanId: { type: Schema.Types.ObjectId, ref: "Player" },
        fielderId: { type: Schema.Types.ObjectId, ref: "Player" }
    },

    nextBatsmanId: { type: Schema.Types.ObjectId, ref: "Player" },
    outWasStriker: { type: Boolean, default: false },

    timestamp: { type: Number, default: Date.now }
});

const InningsSchema = new Schema<InningsPersist>({
    battingTeam: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    bowlingTeam: { type: Schema.Types.ObjectId, ref: "Team", default: null },

    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    deliveries: { type: Number, default: 0 },
    legalBalls: { type: Number, default: 0 },

    currentStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    currentNonStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    currentBowler: { type: Schema.Types.ObjectId, ref: "Player", default: null },

    initialStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    initialNonStriker: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    initialBowler: { type: Schema.Types.ObjectId, ref: "Player", default: null },

    batsmen: [BatsmanSchema],
    bowlers: [BowlerSchema],

    extras: { type: ExtraSchema, default: () => ({}) },
    logs: [BallLogSchema],

    isCompleted: { type: Boolean, default: false },
    isSuperOver: { type: Boolean, default: false },
    oversLimit: { type: Number, default: 20 }
});

const TournamentStatsSchema = new Schema<TournamentMatchPersist>(
    {
        tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
        matchId: { type: Schema.Types.ObjectId, ref: "Matches", required: true },
        umpire: { type: String, default: null, index: true },

        innings1: { type: InningsSchema, required: true },
        innings2: { type: InningsSchema, default: null },

        oversLimit: { type: Number, required: true },

        superOver1: { type: InningsSchema, default: null },
        superOver2: { type: InningsSchema, default: null },
        hasSuperOver: { type: Boolean, default: false },

        currentInnings: { type: Number, default: 1 },

        status: { type: String, enum: ["upcoming", 'ongoing', "completed", "bye"], default: "upcoming" },
        venue: { type: String, default: "" }
    },
    { timestamps: true }
);

export const TournamentMatchStatsModel = model("TournamentStats", TournamentStatsSchema);