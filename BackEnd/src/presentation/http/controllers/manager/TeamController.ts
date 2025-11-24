import {
    IAddTeamUseCase,
    IApprovePlayerUseCase,
    IChangePlayerStatusUseCase,
    IChangeTeamStatusUseCase,
    IEditTeamUseCase,
    IGetAllTeamsUseCase,
    IRejectPlayerUseCase,
    ISwapPlayers
} from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ITeamController } from "presentation/http/interfaces/ITeamController";
import { ILogger } from "app/providers/ILogger";
import { BadRequestError } from "domain/errors";
import { IGetMyTeamDetailsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamMessages } from "domain/constants/TeamMessages";

export class TeamController implements ITeamController {
    constructor(
        private _addTeamUsecase: IAddTeamUseCase,
        private _editTeamUsecase: IEditTeamUseCase,
        private _deleteTeamUsecase: IChangeTeamStatusUseCase,
        private _getTeamsUsecase: IGetAllTeamsUseCase,
        private _getmyTeamsDetailsUsecase: IGetMyTeamDetailsUseCase,
        private _changeStatusUsecase: IChangePlayerStatusUseCase,
        private _approvetoTeamUsecase: IApprovePlayerUseCase,
        private _rejectfromTeamUsecase: IRejectPlayerUseCase,
        private _swapPlayersUsecase: ISwapPlayers,
        private _logger: ILogger,
    ) { }

    /**
     * @description Create a new team for a manager.
     * @param {IHttpRequest} httpRequest - The request containing team data in body and logo file in `file`.
     * @throws {BadRequestError} Throws if no logo file is uploaded.
     * @returns {Promise<IHttpResponse>} - Returns the newly created team data.
     */
    addNewTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const teamData = httpRequest.body;
        const file = httpRequest.file;

        if (!httpRequest.file) throw new BadRequestError("No logo");

        this._logger.info(`[Controller] addNewTeam → managerId=${teamData.managerId}, team=${teamData?.name}`);

        const team = await this._addTeamUsecase.execute(teamData, file);

        this._logger.info(`[Controller] Team created successfully → managerId=${teamData.managerId}`);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, TeamMessages.TEAM_CREATED, team));
    }

    /**
     * @description Edit existing team details.
     * @param {IHttpRequest} httpRequest - The request containing updated team data in body, logo file in `file`, and teamId in params.
     * @returns {Promise<IHttpResponse>} - Returns the updated team data.
     */
    editTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const teamData = httpRequest.body;
        const file = httpRequest.file;
        const { teamId } = httpRequest.params;

        this._logger.info(`[Controller] editTeam → teamId=${teamId}, team=${teamData?.name}`);

        const team = await this._editTeamUsecase.execute(teamData, teamId, file);

        this._logger.info(`[Controller] Team updated successfully → managerId=${teamData.managerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAM_EDITED, team));
    }

    /**
     * @description Soft delete or deactivate a team by its ID.
     * @param {IHttpRequest} httpRequest - The request containing teamId in params.
     * @returns {Promise<IHttpResponse>} - Returns the deleted team’s ID.
     */
    deleteTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId } = httpRequest.params;

        this._logger.info(`[Controller] deleteTeam → teamId=${teamId}`);

        const id = await this._deleteTeamUsecase.execute(teamId);

        this._logger.info(`[Controller] Team deleted successfully → TeamID=${teamId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAM_DELETED, id));
    }

    /**
     * @description Retrieve all teams created by a specific manager.
     * @param {IHttpRequest} httpRequest - The request containing managerId in params.
     * @returns {Promise<IHttpResponse>} - Returns a list of teams under that manager.
     */
    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId } = httpRequest.params;

        this._logger.info(`[Controller] getAllTeams → managerId=${managerId}`);

        const teams = await this._getTeamsUsecase.execute(managerId);

        this._logger.info(`[Controller] ${teams.length} teams fetched → managerId=${managerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAMS_FETCHED, teams));
    }

    /**
     * @description Retrieve team details for the a specific team.
     * @param {IHttpRequest} httpRequest - The request containing teamId in params.
     * @returns {Promise<IHttpResponse>} - Returns team details.
     */

    getTeamDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId } = httpRequest.params;

        this._logger.info(`[TeamController] Join to team Id → teamId=${teamId}`);

        const result = await this._getmyTeamsDetailsUsecase.execute(teamId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAM_DETAILS_FETCHED, result));
    }

    /**
     * @description Change the active/blocked status of a specific player within a team.
     * @param {IHttpRequest} httpRequest - The request containing `teamId` and `playerId` in body.
     * @returns {Promise<IHttpResponse>} - Returns updated list of players for that team.
     */
    changePlayerStatus = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[Controller] changePlayerStatus → teamId=${teamId} playerId=${playerId}`);

        const players = await this._changeStatusUsecase.execute(teamId, playerId);

        this._logger.info(`[Controller] Player status changed successfully → teamId=${teamId} playerId=${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.PLAYER_STATUS_CHANGED, players));
    }


        /**
     * @description Approve a player request and add them to the team.
     * @param {IHttpRequest} httpRequest - The request containing `teamId` and `playerId` in the body.
     * @returns {Promise<IHttpResponse>} - Returns success response with updated team details.
     */
    approvePlayertoTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[TeamController] accept player to team Id → teamId=${teamId}`);

        const result = await this._approvetoTeamUsecase.execute(teamId, playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.PLAYER_APPROVED, result));
    }

    /**
     * @description Reject a player's request to join the team.
     * @param {IHttpRequest} httpRequest - The request containing `teamId` and `playerId` in the body.
     * @returns {Promise<IHttpResponse>} - Returns success response confirming rejection.
     */
    rejectPlayerfromTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[TeamController] reject player from team Id → teamId=${teamId}`);

        const result = await this._rejectfromTeamUsecase.execute(teamId, playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.PLAYER_REJECTED, result));
    }

    /**
     * @description Swap players inside a team (e.g., replace or rotate players).
     * @param {IHttpRequest} httpRequest - The request containing `teamId`, `playerId`, and new `status` in the body.
     * @returns {Promise<IHttpResponse>} - Returns success response after swapping players.
     */
    swapPlayers = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId, status } = httpRequest.body;

        this._logger.info(`[TeamController] swap player in team → teamId=${teamId}`);

        await this._swapPlayersUsecase.execute(teamId, playerId, status);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.PLAYER_SWAPPED));
    }
}