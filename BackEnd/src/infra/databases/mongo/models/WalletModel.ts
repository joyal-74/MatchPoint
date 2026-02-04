import mongoose, { model } from "mongoose";

const WalletSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, refPath: 'ownerModel' },
    ownerType: {
        type: String,
        enum: ['USER', 'TOURNAMENT', 'ADMIN'],
        required: true
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    isFrozen: { type: Boolean, default: false }
}, { timestamps: true });

WalletSchema.virtual('ownerModel').get(function () {
    if (this.ownerType === 'USER') return 'User';
    if (this.ownerType === 'TOURNAMENT') return 'Tournament'; 
    if (this.ownerType === 'ADMIN') return 'Admin';
    return 'User';
});

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export const WalletModel = model('Wallet', WalletSchema);
