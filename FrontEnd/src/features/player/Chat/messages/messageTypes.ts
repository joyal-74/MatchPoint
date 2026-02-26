import type { UserRole } from "../../../../types/UserRoles";

export type ChatParticipantRole = Extract<typeof UserRole[keyof typeof UserRole], "player" | "manager">;

export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    senderName?: string;
    senderRole: ChatParticipantRole;
    text: string;
    createdAt: string | Date;
    status?: "sent" | "pending" | "failed";
    clientId?: string;
    profileImage: string;
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
};


export type TypingUser = {
    id: string;
    name?: string,
    role: ChatParticipantRole;
};