import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { INotificationRepository } from "../../../repositories/interfaces/shared/INotificationRepository";
import { ILogger } from "../../../providers/ILogger";
import { IClearAllNotifications } from "../../../repositories/interfaces/usecases/INotificatinUseCases";

@injectable()
export class ClearAllNotifications implements IClearAllNotifications {
    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepository: INotificationRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(userId: string): Promise<number> {
        this._logger.info(`Attempting to delete all notifications for User: ${userId}`);

        const deletedCount = await this._notificationRepository.deleteAll(userId);

        this._logger.info(`Successfully deleted ${deletedCount} notifications for User: ${userId}`);

        return deletedCount;
    }
}
