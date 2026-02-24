export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    text: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt: Date;
    receiverId?: string;
    clientId?: string;
    profileImage : string;
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
}
