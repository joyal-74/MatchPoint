import { ILogger } from "app/providers/ILogger";
import { IGetPlayerTournaments } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { TournamentMessages } from "domain/constants/TournamentMessages";
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

    /**
     * @description Get all tournaments for a player with optional filters like status and pagination.
     * @param {IHttpRequest} httpRequest - The request object containing query params (status, page, limit, playerId).
     * @returns {Promise<IHttpResponse>} - Returns a paginated & filtered list of tournaments joined by the player.
     */
    getplayerTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { status, page = 1, limit = 10, playerId } = httpRequest.query;

        this._logger.info(
            `[TournamentsController] Fetching player tournaments → playerId=${playerId}, status=${status}, page=${page}, limit=${limit}`
        );

        const result = await this._getplayerTournaments.execute(status, page, limit, playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };
}