import { ILogger } from "app/providers/ILogger";
import { IGetTourLeaderboard } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import {
    IAddTournament,
    ICancelTournament,
    IEditTournament,
    IInitiateTournamentPayment,
    IGetExploreTournaments,
    IGetMyTournaments,
    IGetTournamentDetails,
    IUpdateTournamentTeam,
    IGetRegisteredTeams,
    IGetTournamentFixtures,
    ICreateTournamentFixtures,
    ICreateMatchesUseCase,
    IGetTournamentMatches
} from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { TournamentMessages } from "domain/constants/TournamentMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ITournamentController } from "presentation/http/interfaces/ITournamentController";

export class TournamentController implements ITournamentController {
    constructor(
        private _getMyTournamentsUsecase: IGetMyTournaments,
        private _getExploreTournamentsUsecase: IGetExploreTournaments,
        private _addTournamentsUsecase: IAddTournament,
        private _editTournamentsUsecase: IEditTournament,
        private _cancelTournamentsUsecase: ICancelTournament,
        private _tournamentsDetailsUsecase: IGetTournamentDetails,
        private _entryFeePaymentUsecase: IInitiateTournamentPayment,
        private _updateTournamenTeamUsecase: IUpdateTournamentTeam,
        private _tournamentTeamsUsecase: IGetRegisteredTeams,
        private _getFixturesUsecase: IGetTournamentFixtures,
        private _createFixturesUsecase: ICreateTournamentFixtures,
        private _createMatchesUsecase: ICreateMatchesUseCase,
        private _getMatchesUsecase: IGetTournamentMatches,
        private _getLeaderBoardUsecase: IGetTourLeaderboard,
        private _logger: ILogger
    ) { }

    /**
     * @description Get all tournaments created by a specific manager.
     * @param {IHttpRequest} httpRequest - The request object containing managerId in params.
     * @returns {Promise<IHttpResponse>} - Returns a list of tournaments owned by the manager.
     */
    getMyTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId } = httpRequest.params;

        this._logger.info(`[TournamentController] getAllTournament → managerId=${managerId}`);
        const result = await this._getMyTournamentsUsecase.execute(managerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    /**
     * @description Get all tournaments for explore view with pagination, search, and filters.
     * @param {IHttpRequest} httpRequest - The request containing query params like managerId, page, limit, search, and filter.
     * @returns {Promise<IHttpResponse>} - Returns paginated and filtered list of tournaments.
     */
    getExploreTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId, page, limit, search, filter } = httpRequest.query;

        this._logger.info(`[TournamentController] getAllTournament → managerId=${managerId}`);
        const result = await this._getExploreTournamentsUsecase.execute(managerId, page, limit, search, filter);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENTS_FETCHED, result));
    };

    /**
     * @description Add a new tournament.
     * @param {IHttpRequest} httpRequest - The request containing tournament data in body.
     * @returns {Promise<IHttpResponse>} - Returns the created tournament data.
     */
    addNewTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;
        const file = httpRequest.file;

        this._logger.info(`[TournamentController] addNewTournament → managerId=${tournamentData.managerId}`);
        const result = await this._addTournamentsUsecase.execute(tournamentData, file);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, TournamentMessages.TOURNAMENT_ADDED, result));
    };

    /**
     * @description Edit an existing tournament.
     * @param {IHttpRequest} httpRequest - The request containing updated tournament data in body.
     * @returns {Promise<IHttpResponse>} - Returns the updated tournament data.
     */
    editTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;
        const file = httpRequest.file;


        this._logger.info(`[TournamentController] editTournament → managerId=${tournamentData.managerId}`);
        const result = await this._editTournamentsUsecase.execute(tournamentData, file);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENT_UPDATED, result));
    };

    /**
     * @description Cancel a tournament by ID.
     * @param {IHttpRequest} httpRequest - The request containing tournamentId in params and reason in body.
     * @returns {Promise<IHttpResponse>} - Returns the cancelled tournament details.
     */
    cancelTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const { reason } = httpRequest.body;

        this._logger.info(`[TournamentController] cancel → tournamentId=${tournamentId}`);
        const result = await this._cancelTournamentsUsecase.execute(tournamentId, reason);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENT_CANCELLED, result));
    };

    /**
     * @description Get detailed information of a tournament by ID.
     * @param {IHttpRequest} httpRequest - The request containing tournamentId in params.
     * @returns {Promise<IHttpResponse>} - Returns the tournament details.
     */
    tournamentDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        this._logger.info(`[TournamentController] details → tournamentId=${tournamentId}`);
        const result = await this._tournamentsDetailsUsecase.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TOURNAMENT_DETAILS_FETCHED, result));
    };

    /**
     * @description Initiate or verify entry fee payment for a tournament registration.
     * @param {IHttpRequest} httpRequest - The request containing tournamentId in params and payment details in body.
     * @returns {Promise<IHttpResponse>} - Returns payment initiation or verification response.
     */
    entryFeePayment = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const { teamId, captainId, paymentMethod, managerId } = httpRequest.body;

        this._logger.info(`[TournamentController] entryFee → tournamentId=${tournamentId}`);
        const result = await this._entryFeePaymentUsecase.execute(tournamentId, teamId, captainId, managerId, paymentMethod);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.ENTRY_FEE_PAID, result));
    };

    /**
     * @description Update a tournament team's registration payment status.
     * @param {IHttpRequest} httpRequest - The request containing registrationId in params and payment details in body.
     * @returns {Promise<IHttpResponse>} - Returns updated tournament data.
     */
    updateTounamentTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { registrationId } = httpRequest.params;
        const { paymentStatus, paymentId, managerId } = httpRequest.body;

        const result = await this._updateTournamenTeamUsecase.execute(managerId, registrationId, paymentStatus, paymentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.TEAM_REGISTRATION_UPDATED, result));
    };

    /**
     * @description Get all registered teams for a specific tournament.
     * @param {IHttpRequest} httpRequest - The request containing tournamentId in params.
     * @returns {Promise<IHttpResponse>} - Returns the list of teams registered in that tournament.
     */
    getTournamentTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        const result = await this._tournamentTeamsUsecase.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.REGISTERED_TEAMS_FETCHED, result));
    };

    /**
     * @description Get the fixtures (schedule) of a specific tournament.
     * @param {IHttpRequest} httpRequest - The request containing `tournamentId` in params.
     * @returns {Promise<IHttpResponse>} - Returns the fixture details of the tournament.
     */
    getTournamentFixtures = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        const result = await this._getFixturesUsecase.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.FIXTURES_FETCHED, result));
    };

    /**
     * @description Get all matches for a specific tournament.
     * @param {IHttpRequest} httpRequest - The request containing `tournamentId` in params.
     * @returns {Promise<IHttpResponse>} - Returns the list of tournament matches.
     */
    getTournamentMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        const result = await this._getMatchesUsecase.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.MATCHES_FETCHED, result));
    };

    /**
     * @description Create matches for a tournament before fixture generation.
     * @param {IHttpRequest} httpRequest - The request containing `tournamentId` in params and `matchesData` in body.
     * @returns {Promise<IHttpResponse>} - Returns created match records for the tournament.
     */
    createTournamentMatches = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const matchesData = httpRequest.body.matchesData;

        const result = await this._createMatchesUsecase.execute(tournamentId, matchesData);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, TournamentMessages.MATCHES_CREATED, result));
    };

    /**
     * @description Generate fixtures for a tournament based on match IDs and tournament format.
     * @param {IHttpRequest} httpRequest - The request containing `tournamentId` in params and `{ matchIds, format }` in body.
     * @returns {Promise<IHttpResponse>} - Returns generated fixture schedule for the tournament.
     */
    createTournamentFixtures = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const { matchIds, format } = httpRequest.body;

        const result = await this._createFixturesUsecase.execute(tournamentId, matchIds, format);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, TournamentMessages.FIXTURES_CREATED, result));
    };


    getTournamentLeaderBoard = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        const result = await this._getLeaderBoardUsecase.execute(tournamentId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TournamentMessages.LEADERBOARD_FETCHED, result));
    };
}