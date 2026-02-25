import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { IGetPlayerMatches, IGetPlayerTournamentMatches, IGetPlayerTournaments, IGetTournamentPointsTable, IGetTournamentStats } from "../../../../app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { ITournamentDetails } from "../../../../app/repositories/interfaces/player/ITournamentUsecases";
import { ILogger } from "../../../../app/providers/ILogger";
import { TournamentMessages } from "../../../../domain/constants/TournamentMessages";

@injectable()
export class TournamentsController {
    constructor(
        @inject(DI_TOKENS.GetPlayerTournaments) private _getplayerTournaments: IGetPlayerTournaments,
        @inject(DI_TOKENS.GetPlayerTournamentDetails) private _getplayerTournamentDetails: ITournamentDetails,
        @inject(DI_TOKENS.FetchMatchesUseCase) private _getplayerMatches: IGetPlayerMatches,
        @inject(DI_TOKENS.GetPlayerTournamentMatches) private _getplayerTournamentMatches: IGetPlayerTournamentMatches,
        @inject(DI_TOKENS.GetTournamentPointsTable) private _getTournamentPointsTable: IGetTournamentPointsTable,
        @inject(DI_TOKENS.GetTournamentStats) private _getTournamentstats: IGetTournamentStats,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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

    getPlayerTournamentDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { tournamentId } = httpRequest.body;

        this._logger.info(
            `[TournamentsController] Fetching player tournaments → tournamentId=${tournamentId}`
        );

        const result = await this._getplayerTournamentDetails.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    getplayerTournamentMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { tournamentId } = httpRequest.body;

        this._logger.info(
            `[TournamentsController] Fetching matches → ${tournamentId} , `
        );

        const result = await this._getplayerTournamentMatches.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    getplayerMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { status, page = 1, limit = 10 } = httpRequest.query;

        this._logger.info(
            `[TournamentsController] Fetching live matches → , status=${status}, page=${page}, limit=${limit}`
        );

        const result = await this._getplayerMatches.execute(status, page, Number(limit));

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    getTournamentPointsTable = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { tournamentId } = httpRequest.body;

        this._logger.info(
            `[TournamentsController] Fetching points table for ${tournamentId}`
        );

        const result = await this._getTournamentPointsTable.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    getTournamentStats = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { tournamentId } = httpRequest.body;

        this._logger.info(
            `[TournamentsController] Fetching points table for ${tournamentId}`
        );

        const result = await this._getTournamentstats.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };
}
