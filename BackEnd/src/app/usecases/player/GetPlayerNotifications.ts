import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { IGetPlayerNotificationsUseCase } from "app/repositories/interfaces/player/INotificationUseCase";

@injectable()
export class GetPlayerNotificationsUseCase implements IGetPlayerNotificationsUseCase {
    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async execute(playerId: string) {
        const notification = await this._notificationRepo.findByUser(playerId);
        return notification
    }
}