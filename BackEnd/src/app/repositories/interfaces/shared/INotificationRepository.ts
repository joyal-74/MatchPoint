import { Types } from "mongoose";

export interface CreateNotificationDTO {
    userId: Types.ObjectId | string;
    type: "TEAM_INVITE" | "MATCH_ALERT" | "ANNOUNCEMENT" | "TEAM_JOIN_REQUEST";
    title: string;
    message: string;
    meta?: Record<string, string | number>;
}

export interface NotificationResponse {
    _id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    meta?: Record<string, string | number>;
    isRead: boolean;
    createdAt: Date;
}

export interface INotificationRepository {
    create(data: CreateNotificationDTO): Promise<NotificationResponse>;

    findByUser(userId: string, options?: { limit?: number; skip?: number; unreadOnly?: boolean; }): Promise<NotificationResponse[]>;

    markAsRead(notificationId: string, userId: string): Promise<NotificationResponse | null>;

    markAllAsRead(userId: string): Promise<void>;

    getUnreadCount(userId: string): Promise<number>;

    markInviteAsRead(playerId: string, teamId: string, status : string): Promise<void>;
}