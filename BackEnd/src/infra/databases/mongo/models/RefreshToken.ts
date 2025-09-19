import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    token: string;
    userId: string;
    expiresAt: Date;
    isRevoked: boolean;
}

const RefreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
},{timestamps : true});

export const RefreshTokenModel = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);