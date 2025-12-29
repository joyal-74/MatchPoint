import { Schema, model, Document, Types } from "mongoose";

export interface NotificationDocument extends Document {
    _id: Types.ObjectId,
    userId: Types.ObjectId;
    type: string;
    title: string;
    message: string;
    meta?: Record<string, string | number>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        meta: {
            type: Schema.Types.Mixed
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

export const NotificationModel = model<NotificationDocument>("Notification", NotificationSchema);