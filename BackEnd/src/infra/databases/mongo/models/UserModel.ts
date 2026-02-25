import { User } from '../../../../domain/entities/User';
import { GenderValues, RoleValues, Theme, ThemeValues } from '../../../../domain/enums/index';
import { Schema, model, HydratedDocument } from 'mongoose';
import { UserSchemaType } from '../types/UserDocument';

export type UserDocument = HydratedDocument<User>;


const UserSchema = new Schema<UserSchemaType>({
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String },
    bio: { type: String },
    phone: { type: String, required: true },
    gender: { type: String, enum: GenderValues },
    role: { type: String, enum: RoleValues, required: true },
    refreshToken: { type: String, default: null },
    wallet: { type: Number, default: 0 },
    sport: { type: String },
    settings: {
        location: { type: String },
        country: { type: String },
        theme: { type: String, enum: ThemeValues, default: Theme.Dark },
        language: { type: String, default: "en" },
        currency: { type: String, default: "INR" }
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    authProvider: { type: String, default: null },
    subscription: { type: String, default: "Free" }
}, { timestamps: true });


export const UserModel = model<UserSchemaType>("User", UserSchema);
