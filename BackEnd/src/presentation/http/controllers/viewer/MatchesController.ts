import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { ILogger } from "../../../../app/providers/ILogger.js";
import { IGetLiveMatches, IGetMatchUpdates } from "../../../../app/repositories/interfaces/usecases/IViewerUsecaseRepository.js";

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
