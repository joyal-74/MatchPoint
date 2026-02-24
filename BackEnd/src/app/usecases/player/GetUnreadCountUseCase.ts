import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetUnreadCountUseCase } from "../../repositories/interfaces/player/INotificationUseCase.js";
import { INotificationRepository } from "../../repositories/interfaces/shared/INotificationRepository.js";


@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {

    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async execute(playerId: string) {
        return this._notificationRepo.getUnreadCount(playerId);
    }
}