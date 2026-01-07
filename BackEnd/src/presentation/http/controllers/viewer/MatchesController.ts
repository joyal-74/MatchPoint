import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ILogger } from "app/providers/ILogger";
import { IGetLiveMatches, IGetMatchUpdates } from "app/repositories/interfaces/usecases/IViewerUsecaseRepository";

@injectable()
export class MatchesController {
    constructor(
        @inject(DI_TOKENS.GetLiveMatches) private _getLiveMatchesUC: IGetLiveMatches,
        @inject(DI_TOKENS.GetMatchUpdates) private _getLiveUpdates: IGetMatchUpdates,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    getLiveMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const viewerId = httpRequest.params.viewerId;

        this._logger.info(`Fetching matches by viewer ID: ${viewerId}`);

        const matches = await this._getLiveMatchesUC.execute();

        this._logger.info(`Live matches fetched successfully for viewer ID: ${viewerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'matches fetched', matches));
    }

    getLiveUpdates = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;

        this._logger.info(`Fetching updates by matchId ID: ${matchId}`);

        const matches = await this._getLiveUpdates.execute(matchId);

        this._logger.info(`Live matches updates successfully for viewer ID: ${matchId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'matches details fetched', matches));
    }
}