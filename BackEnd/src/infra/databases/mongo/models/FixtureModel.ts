import { Schema, Types, model } from 'mongoose';

const fixtureSchema = new Schema({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    format: { type: String, enum: ["knockout", "league", "friendly"], required: true },
    matches: [{
        matchId: { type: Types.ObjectId, ref: 'Matches' },
        round: Number,
    }],
}, { timestamps: true });

export default model("Fixture", fixtureSchema);