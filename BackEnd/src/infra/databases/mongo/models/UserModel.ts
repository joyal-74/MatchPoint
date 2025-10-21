import { User, UserSettings } from 'domain/entities/User';
import { GenderValues, RoleValues, Theme, ThemeValues } from 'domain/enums';
import { Schema, model, Document, Types } from 'mongoose';

export interface UserDocument extends Omit<User, 'userId'>, Document {
    _id: Types.ObjectId;
    userId: string;
    sport: string;
    refreshToken?: string | null;
    settings: UserSettings;
}

const UserSchema = new Schema<UserDocument>({
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true, },
    password: { type: String },
    bio: { type: String },
    phone: { type: String, required : true },
    gender: { type: String, enum: GenderValues },
    role: { type: String, enum: RoleValues, required: true },
    refreshToken: { type: String, default: null },
    wallet: { type: Number, default: 0 },
    sport: { type: String },
    settings: {
        location: { type: String },
        country: { type: String },
        theme: { type: String, enum: ThemeValues, default: Theme.Dark },
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'INR' },
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', UserSchema);