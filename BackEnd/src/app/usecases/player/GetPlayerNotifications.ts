import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetPlayerNotificationsUseCase } from "../../repositories/interfaces/player/INotificationUseCase.js";
import { INotificationRepository } from "../../repositories/interfaces/shared/INotificationRepository.js";

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
