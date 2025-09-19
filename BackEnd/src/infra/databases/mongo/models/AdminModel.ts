import { Document, Schema, Types, model } from 'mongoose';
import { AdminWithPassword } from 'domain/entities/Admin';
import { Theme, ThemeValues } from 'domain/enums';

interface AdminDocument extends Document<Types.ObjectId>, Omit<AdminWithPassword, '_id'> { }

const AdminSchema = new Schema<AdminDocument>({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    settings: {
        theme: { type: String, enum: ThemeValues, default: Theme.Dark },
        language: { type: String, default: 'en' },
        currency: { type: String, default: 'USD' },
    },
}, { timestamps: true });

export const AdminModel = model<AdminDocument>('Admin', AdminSchema);