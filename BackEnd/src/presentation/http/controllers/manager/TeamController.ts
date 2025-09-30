import { IAddTeamUseCase, IChangePlayerStatusUseCase, IGetAllTeamsUseCase } from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ITeamController } from "presentation/http/interfaces/ITeamController";
import { ILogger } from "app/providers/ILogger";
import { BadRequestError } from "domain/errors";

export class TeamController implements ITeamController {
    constructor(
        private _addTeamUsecase: IAddTeamUseCase,
        private _getTeamsUsecase: IGetAllTeamsUseCase,
        private _changeStatusUsecase: IChangePlayerStatusUseCase,
        private _logger: ILogger,
    ) { }

    addNewTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const teamData = httpRequest.body;
        const file = httpRequest.file;

        console.log("req.file", httpRequest.file);
        console.log("req.body", httpRequest.body);

        if(!httpRequest.file) throw new BadRequestError("No logo");
        


        this._logger.info(`[Controller] addNewTeam → managerId=${teamData.managerId}, team=${teamData?.name}`);

        const team = await this._addTeamUsecase.execute(teamData, file);

        this._logger.info(`[Controller] Team created successfully → managerId=${teamData.managerId}`);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, "Team created successfully", team));
    }

    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId } = httpRequest.params;
        this._logger.info(`[Controller] getAllTeams → managerId=${managerId}`);

        const teams = await this._getTeamsUsecase.execute(managerId);

        this._logger.info(`[Controller] ${teams.length} teams fetched → managerId=${managerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Teams fetched successfully", teams));
    }

    changePlayerStatus = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[Controller] changePlayerStatus → teamId=${teamId} playerId=${playerId}`);

        console.log(teamId, playerId)

        const players = await this._changeStatusUsecase.execute(teamId, playerId);

        this._logger.info(`[Controller] Player status changed successfully → teamId=${teamId} playerId=${playerId}`);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Player status changed successfully", players));
    }
}