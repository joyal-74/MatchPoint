import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetPlayerNotificationsUseCase, IGetUnreadCountUseCase } from "app/repositories/interfaces/player/INotificationUseCase";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

@injectable()
export class NotificationController {
    constructor(
        @inject(DI_TOKENS.GetPlayerNotificationsUseCase) private _getPlayerNotificationsUseCase: IGetPlayerNotificationsUseCase,
        @inject(DI_TOKENS.GetUnreadCountUseCase) private _getUnreadCountUseCase: IGetUnreadCountUseCase
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
}