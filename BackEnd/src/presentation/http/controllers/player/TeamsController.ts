import { ILogger } from "app/providers/ILogger";
import {
    IGetAllMyTeamsUseCase,
    IGetAllTeamsUseCase,
    IGetMyTeamDetailsUseCase,
    IGetMyTeamsUseCase,
    IJoinTeamUseCase
} from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IPlayerTeamController } from "presentation/http/interfaces/IPlayerTeamController";

export class TeamsController implements IPlayerTeamController {
    constructor(
        private _getAllTeamsUsecase: IGetAllTeamsUseCase,
        private _joinTeamsUsecase: IJoinTeamUseCase,
        private _getmyTeamsUsecase: IGetMyTeamsUseCase,
        private _getAllMyTeamsUsecase: IGetAllMyTeamsUseCase,
        private _getmyTeamsDetailsUsecase: IGetMyTeamDetailsUseCase,
        private _logger: ILogger
    ) { }

    /**
     * @description Get all teams with optional filters.
     * @param {IHttpRequest} httpRequest - The request object containing filters in params.
     * @returns {Promise<IHttpResponse>} - Returns list of teams.
     */
    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { filters } = httpRequest.params;

        this._logger.info(`[TeamController] getAllTeams → filters=${filters}`);

        const result = await this._getAllTeamsUsecase.execute(filters);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Teams fetched successfully", result));
    };

    /**
     * @description Allows a player to join a team.
     * @param {IHttpRequest} httpRequest - The request containing playerId and teamId in body.
     * @returns {Promise<IHttpResponse>} - Returns success response on joining.
     */
    joinTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[TeamController] joinTeams → playerId=${playerId}, teamId=${teamId}`);

        const result = await this._joinTeamsUsecase.execute(playerId, teamId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Joined team successfully", result)
        );
    };

    /**
     * @description Get teams of a player filtered by membership status.
     * @param {IHttpRequest} httpRequest - The request containing playerId and status in params.
     * @returns {Promise<IHttpResponse>} - Returns filtered player teams.
     */
    getMyTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId, status } = httpRequest.params;

        this._logger.info(`[TeamController] getMyTeams → playerId=${playerId}, status=${status}`);

        const result = await this._getmyTeamsUsecase.execute(playerId, status);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Teams fetched successfully", result)
        );
    };

    /**
     * @description Get all teams related to the player (joined, requested, pending etc.).
     * @param {IHttpRequest} httpRequest - The request containing playerId in params.
     * @returns {Promise<IHttpResponse>} - Returns all player teams.
     */
    getAllMyTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;

        this._logger.info(`[TeamController] getAllMyTeams → playerId=${playerId}`);

        const result = await this._getAllMyTeamsUsecase.execute(playerId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Teams fetched successfully", result)
        );
    };

    /**
     * @description Get detailed information of a specific team.
     * @param {IHttpRequest} httpRequest - The request containing teamId in params.
     * @returns {Promise<IHttpResponse>} - Returns team details.
     */
    getTeamDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId } = httpRequest.params;

        this._logger.info(`[TeamController] getTeamDetails → teamId=${teamId}`);

        const result = await this._getmyTeamsDetailsUsecase.execute(teamId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Team details fetched successfully", result)
        );
    };
}