import { ILogger } from "app/providers/ILogger";
import { IGetAllMyTeamsUseCase, IGetAllTeamsUseCase, IGetMyTeamDetailsUseCase, IGetMyTeamsUseCase, IJoinTeamUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
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

    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { filters } = httpRequest.params;

        console.log(filters)

        this._logger.info(`[TeamController] getAllTeamswith filters → managerId=${filters}`);

        const result = await this._getAllTeamsUsecase.execute(filters);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Teams fetched successfully", result));
    };

    joinTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[TeamController] Join to team Id → playerId=${playerId}`);

        const result = await this._joinTeamsUsecase.execute(playerId, teamId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Joined to team successfully", result));
    };

    getMyTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId, status } = httpRequest.params;

        this._logger.info(`[TeamController] Join to team Id → playerId=${playerId}`);

        const result = await this._getmyTeamsUsecase.execute(playerId, status);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Team fetched successfully", result));
    }

    getAllMyTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { playerId } = httpRequest.params;

        this._logger.info(`[TeamController] Join to team Id → playerId=${playerId}`);

        const result = await this._getAllMyTeamsUsecase.execute(playerId);

        console.log(result, "=====")

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Team fetched successfully", result));
    }

    getTeamDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId } = httpRequest.params;

        this._logger.info(`[TeamController] Join to team Id → teamId=${teamId}`);

        const result = await this._getmyTeamsDetailsUsecase.execute(teamId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Team detailed fetched successfully", result));
    }
}