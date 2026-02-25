import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { IGetPlayerNotificationsUseCase, IGetUnreadCountUseCase, IMarkAllNotificationRead, IMarkNotificationRead } from "../../../../app/repositories/interfaces/player/INotificationUseCase.js";
import { IClearAllNotifications } from "../../../../app/repositories/interfaces/usecases/INotificatinUseCases.js";
@injectable()
export class NotificationController {
    constructor(
        @inject(DI_TOKENS.GetPlayerNotificationsUseCase) private _getPlayerNotificationsUseCase: IGetPlayerNotificationsUseCase,
        @inject(DI_TOKENS.GetUnreadCountUseCase) private _getUnreadCountUseCase: IGetUnreadCountUseCase,
        @inject(DI_TOKENS.MarkNotificationRead) private _markAsReadUseCase: IMarkNotificationRead,
        @inject(DI_TOKENS.GetUnreadCountUseCase) private _markallAsReadUseCase: IMarkAllNotificationRead,
        @inject(DI_TOKENS.ClearAllNotifications) private _clearAllNotifications: IClearAllNotifications
    ) { }

    getNotifications = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;

        const notifications = await this._getPlayerNotificationsUseCase.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications fetched successfully", notifications));
    }

    getUnreadCount = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;

        const count = await this._getUnreadCountUseCase.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications count fetched", count));
    }

    markAsRead = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { notificationId, userId } = httpRequest.body;

        const count = await this._markAsReadUseCase.execute(notificationId, userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications mark as read", count));
    }

    markAllAsRead = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId } = httpRequest.body;

        const count = await this._markallAsReadUseCase.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "All Notifications marked as read", count));
    }

    deleteAllNotifications = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.body;

        const count = await this._clearAllNotifications.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "All Notifications deleted", count));
    }
}