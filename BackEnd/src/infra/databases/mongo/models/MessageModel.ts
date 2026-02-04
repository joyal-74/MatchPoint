import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId, name: string };
    text: string;
    status: 'pending' | 'sent' | 'failed';
    clientId?: string;
    receiverId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'sent' },
    clientId: String,
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

export const MessageModel = model<IMessage>('Message', messageSchema);
