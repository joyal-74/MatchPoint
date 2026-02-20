import { Types } from "mongoose";
import { IBaseRepository } from "../../IBaseRepository.js";

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

export interface INotificationRepository extends IBaseRepository<CreateNotificationDTO, NotificationResponse> {
    
    findByUser(userId: string, options?: { limit?: number; skip?: number; unreadOnly?: boolean; }): Promise<NotificationResponse[]>;
    getUnreadCount(userId: string): Promise<number>;

    markAsRead(notificationId: string, userId: string): Promise<NotificationResponse | null>;
    markAllAsRead(userId: string): Promise<void>;
    
    markInviteAsRead(playerId: string, teamId: string, status: string): Promise<void>;
}