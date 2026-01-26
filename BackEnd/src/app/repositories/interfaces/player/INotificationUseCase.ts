import { NotificationResponse } from
  "../shared/INotificationRepository";

export interface IGetPlayerNotificationsUseCase {
    execute(playerId: string): Promise<NotificationResponse[]>;
}

export interface IGetUnreadCountUseCase {
    execute(playerId: string): Promise<number>;
}

export interface IMarkNotificationRead {
    execute(notificationId: string,  userId : string): Promise<NotificationResponse>;
}

export interface IMarkAllNotificationRead {
    execute(userId : string): Promise<void>;
}
