import mongoose, { Schema, Document } from "mongoose";

export interface IPayoutMappingSchema extends Document {
    internalMethodId: mongoose.Types.ObjectId;
    provider: 'RAZORPAY';
    externalFundAccountId: string;
}

const PayoutMappingSchema = new Schema<IPayoutMappingSchema>({
    internalMethodId: { type: Schema.Types.ObjectId, ref: 'PayoutMethod', required: true },
    provider: { type: String, required: true, default: 'RAZORPAY' },
    externalFundAccountId: { type: String, required: true }
});

export default mongoose.model<IPayoutMappingSchema>("PayoutMapping", PayoutMappingSchema);