import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { IMarkAllNotificationRead } from "app/repositories/interfaces/player/INotificationUseCase";
import { ILogger } from "app/providers/ILogger";

@injectable()
export class MarkAllNotificationRead implements IMarkAllNotificationRead {
    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(userId: string): Promise<void> {
        this._logger.info(`Attempting to mark all notifications as read for user: ${userId}`);

        await this._notificationRepo.markAllAsRead(userId);
        this._logger.info(`Successfully marked all notifications as read for user: ${userId}`);
    }
}