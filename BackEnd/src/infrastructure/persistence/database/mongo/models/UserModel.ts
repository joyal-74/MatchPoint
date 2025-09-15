import { Schema, model, Document, Types } from 'mongoose';
import type { User, UserSettings } from '../../../../../core/domain/entities/User';
import { UserRole, Gender, Theme } from '../../../../../core/domain/types/UserRoles';

interface UserDocument extends Omit<User, 'userId'>, Document {
    _id: Types.ObjectId;
    userId: string;
    settings: UserSettings;
}

const UserSchema = new Schema<UserDocument>({
    userId: { type: String, required: true, unique: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender) },
    role: { type: String, enum: Object.values(UserRole), required: true },
    wallet: { type: Number, default: 0 },
    settings: {
        location: { type: String },
        country: { type: String },
        theme: { type: String, enum: Object.values(Theme), default: Theme.DARK },
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'USD' },
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', UserSchema);