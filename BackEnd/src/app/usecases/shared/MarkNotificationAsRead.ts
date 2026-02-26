import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IMarkNotificationRead } from "../../repositories/interfaces/player/INotificationUseCase";
import { INotificationRepository, NotificationResponse } from "../../repositories/interfaces/shared/INotificationRepository";
import { NotFoundError } from "../../../domain/errors/index";


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
