import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IGetMyTeamDetailsUseCase, IGetPlayerJoinedTeamsUseCase, IGetPlayerTeamsUseCase, IJoinTeamUseCase, IUpdatePlayerInviteStatus } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamMessages } from "domain/constants/TeamMessages";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { IPlayerTeamController } from "presentation/http/interfaces/IPlayerTeamController";

@injectable()
export class TeamsController implements IPlayerTeamController {
    constructor(
        @inject(DI_TOKENS.JoinTeamUseCase) private _joinTeamsUsecase: IJoinTeamUseCase,
        @inject(DI_TOKENS.GetPlayerTeamsUseCase) private _getplayerTeamsUsecase: IGetPlayerTeamsUseCase,
        @inject(DI_TOKENS.GetPlayerJoinedTeamsUseCase) private _getPlayerJoinedTeamsUsecase: IGetPlayerJoinedTeamsUseCase,
        @inject(DI_TOKENS.GetMyTeamDetailsUseCase) private _getmyTeamsDetailsUsecase: IGetMyTeamDetailsUseCase,
        @inject(DI_TOKENS.UpdatePlayerInviteStatus) private _updateInviteStatusUseCase: IUpdatePlayerInviteStatus,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    /**
     * @description Get all teams with optional filters.
     * @param {IHttpRequest} httpRequest - The request object containing filters in params.
     * @returns {Promise<IHttpResponse>} - Returns list of teams.
     */
    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const filters = httpRequest.query;
        console.log(httpRequest.query, ' lajdlkafdaksf')

        this._logger.info(`[TeamController] getAllTeams`);

        const result = await this._getplayerTeamsUsecase.execute(filters);

        console.log(result, 'result')

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAMS_FETCHED, result));
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

        console.log(result)

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, TeamMessages.TEAM_JOINED, result)
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

        const result = await this._getPlayerJoinedTeamsUsecase.execute(playerId, status);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAMS_FETCHED, result));
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
            buildResponse(true, TeamMessages.TEAM_DETAILS_FETCHED, result)
        );
    };


    updateStatus = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;
        const { teamId, status } = httpRequest.body;

        const result = await this._updateInviteStatusUseCase.execute({ playerId, teamId, status });

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAM_INVITE_PLAYER, result));
    };
}