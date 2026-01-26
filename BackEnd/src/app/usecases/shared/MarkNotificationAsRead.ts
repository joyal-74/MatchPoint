import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { INotificationRepository, NotificationResponse } from "app/repositories/interfaces/shared/INotificationRepository";
import { IMarkNotificationRead } from "app/repositories/interfaces/player/INotificationUseCase";
import { NotFoundError } from "domain/errors";

@injectable()
export class MarkNotificationRead implements IMarkNotificationRead {
    constructor(
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async execute(notificationId: string, userId : string) : Promise<NotificationResponse>{
        const notification = await this._notificationRepo.markAsRead(notificationId, userId);
        if(!notification) {
            throw new NotFoundError('Notification not found')
        }
        return notification
    }
}