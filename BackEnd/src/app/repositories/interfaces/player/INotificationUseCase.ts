import { NotificationResponse } from
  "../shared/INotificationRepository";

export interface IGetPlayerNotificationsUseCase {
    execute(playerId: string): Promise<NotificationResponse[]>;
}

export interface IGetUnreadCountUseCase {
    execute(playerId: string): Promise<number>;
}
