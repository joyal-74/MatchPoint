import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { IGetUnreadCountUseCase } from "app/repositories/interfaces/player/INotificationUseCase";

@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {

    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async execute(playerId: string) {
        return this._notificationRepo.getUnreadCount(playerId);
    }
}
