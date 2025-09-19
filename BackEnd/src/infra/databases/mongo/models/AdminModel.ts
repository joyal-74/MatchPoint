import { Document, Schema, Types, model } from 'mongoose';
import { Admin } from 'domain/entities/Admin';
import { Theme, ThemeValues } from 'domain/enums';

interface AdminDocument extends Document<Types.ObjectId>, Omit<Admin, '_id'> { }

const AdminSchema = new Schema<AdminDocument>({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    refreshToken: { type: String },
    settings: {
        theme: { type: String, enum: ThemeValues, default: Theme.Dark },
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'INR' },
    },
}, { timestamps: true });

export const AdminModel = model<AdminDocument>('Admin', AdminSchema);