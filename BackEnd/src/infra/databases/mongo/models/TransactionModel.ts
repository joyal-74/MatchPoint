import { model, Schema, Types } from "mongoose";

const TransactionSchema = new Schema({
    type: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAWAL', 'ENTRY_FEE', 'PRIZE', 'REFUND', 'SUBSCRIPTION'],
        required: true
    },
    fromWalletId: { type: Types.ObjectId, ref: 'Wallet', default: null },
    toWalletId: { type: Types.ObjectId, ref: 'Wallet', default: null },
    
    amount: { type: Number, required: true },
    
    paymentProvider: { type: String, enum: ['RAZORPAY', 'STRIPE', 'INTERNAL'], default: 'INTERNAL' },
    paymentRefId: { type: String },

    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    
    metadata: {
        tournamentId: { type: Types.ObjectId, ref: 'Tournament' },
        description: String
    }
}, { timestamps: true });

export const TransactionModel = model('Transaction', TransactionSchema);