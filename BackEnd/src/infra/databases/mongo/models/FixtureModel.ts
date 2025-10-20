import { Schema, model } from 'mongoose';

const matchSchema = new Schema({
    homeTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    awayTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    round: Number,
    date: Date,
    status: { type: String, enum: ["upcoming", "completed", "bye"], default: "upcoming" },
    result: {
        homeScore: Number,
        awayScore: Number,
    },
});

const fixtureSchema = new Schema({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    format: { type: String, enum: ["knockout", "league", "friendly"], required: true },
    matches: [matchSchema],
}, { timestamps: true });

export default model("Fixture", fixtureSchema);
