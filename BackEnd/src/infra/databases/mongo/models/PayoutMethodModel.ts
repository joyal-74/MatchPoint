import mongoose, { Schema, Document } from "mongoose";

export interface IPayoutSchema extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'bank' | 'upi';
    name: string;
    detail: string;
    encryptedDetail: string;
    ifsc?: string;
    isPrimary: boolean;
}

const PayoutSchema = new Schema<IPayoutSchema>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['bank', 'upi'], required: true },
    name: { type: String, required: true },
    detail: { type: String, required: true },
    encryptedDetail: { type: String, required: true },
    ifsc: { type: String },
    isPrimary: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IPayoutSchema>("PayoutMethod", PayoutSchema);