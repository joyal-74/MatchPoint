import { Schema, model, Document } from 'mongoose';
import type { User, UserSettings } from '../../../../../core/domain/entities/User';
import { UserRole, Gender, Theme } from '../../../../../core/domain/types/UserRoles';

interface UserDocument extends Omit<User, 'userId'>, Document {
    userId: string;
    settings: UserSettings;
}

const UserSchema = new Schema<UserDocument>({
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
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', UserSchema);
