import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { IGetPlayerNotificationsUseCase } from "app/repositories/interfaces/player/INotificationUseCase";

export class GetPlayerNotificationsUseCase implements IGetPlayerNotificationsUseCase {

    constructor(
        private _notificationRepo: INotificationRepository
    ) { }

    async execute(playerId: string) {
        return this._notificationRepo.findByUser(playerId,);
    }
}