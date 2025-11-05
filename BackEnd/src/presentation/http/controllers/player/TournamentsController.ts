import { ILogger } from "app/providers/ILogger";
import { IGetPlayerTournaments } from "app/repositories/interfaces/player/ITournamentsRepoUsecaes";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class TournamentsController {
    constructor(
        private _getplayerTournaments: IGetPlayerTournaments,
        private _logger: ILogger
    ) { }

    getplayerTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { status, page = 1, limit = 10, playerId } = httpRequest.query;
        console.log(httpRequest.query, 'query')

        this._logger.info(`[TournamentsController] Fetch tournaments`);

        const result = await this._getplayerTournaments.execute(status, page, limit, playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments fetched successfully", result));
    };

}