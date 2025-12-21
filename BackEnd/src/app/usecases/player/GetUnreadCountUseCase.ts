import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { IGetUnreadCountUseCase } from "app/repositories/interfaces/player/INotificationUseCase";

export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {

    constructor(
        private _notificationRepo: INotificationRepository
    ) { }

    async execute(playerId: string) {
        return this._notificationRepo.getUnreadCount(playerId);
    }
}
