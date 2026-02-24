export interface CreateMessageDTO {
    chatId: string;
    senderId: string;
    text: string;
    clientId: string;
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
}
