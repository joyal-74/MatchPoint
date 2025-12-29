import mongoose, { model } from "mongoose";

const WalletSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerType: { 
        type: String, 
        enum: ['USER', 'TOURNAMENT', 'ADMIN'],
        required: true 
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    isFrozen: { type: Boolean, default: false }
}, { timestamps: true });

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export const WalletModel = model('Wallet', WalletSchema);