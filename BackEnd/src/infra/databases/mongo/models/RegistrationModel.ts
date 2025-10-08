import mongoose, { Schema } from 'mongoose';

const RegistrationSchema = new Schema({
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    captainId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String, default: null },
}, { timestamps: true });

export const RegistrationModel = mongoose.model('Registration', RegistrationSchema);