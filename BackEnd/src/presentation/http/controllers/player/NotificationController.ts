import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetPlayerNotificationsUseCase, IGetUnreadCountUseCase, IMarkAllNotificationRead, IMarkNotificationRead } from "app/repositories/interfaces/player/INotificationUseCase";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

@injectable()
export class NotificationController {
    constructor(
        @inject(DI_TOKENS.GetPlayerNotificationsUseCase) private _getPlayerNotificationsUseCase: IGetPlayerNotificationsUseCase,
        @inject(DI_TOKENS.GetUnreadCountUseCase) private _getUnreadCountUseCase: IGetUnreadCountUseCase,
        @inject(DI_TOKENS.MarkNotificationRead) private _markAsReadUseCase: IMarkNotificationRead,
        @inject(DI_TOKENS.GetUnreadCountUseCase) private _markallAsReadUseCase: IMarkAllNotificationRead
    ) {}

    getNotifications = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;

        const notifications = await this._getPlayerNotificationsUseCase.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications fetched successfully", notifications));
    }

    getUnreadCount  = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> =>  {
        const { playerId } = httpRequest.params;

        const count = await this._getUnreadCountUseCase.execute(playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications count fetched", count));
    }

    markAsRead  = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> =>  {
        const { notificationId, userId } = httpRequest.body;

        console.log(httpRequest.body, 'body')

        const count = await this._markAsReadUseCase.execute(notificationId, userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Notifications mark as read", count));
    }

    markAllAsRead  = async (httpRequest: IHttpRequest) : Promise<IHttpResponse> =>  {
        const { userId } = httpRequest.body;

        const count = await this._markallAsReadUseCase.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "All Notifications marked as read", count));
    }
}