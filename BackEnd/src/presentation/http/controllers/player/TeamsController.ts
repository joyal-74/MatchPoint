import { ILogger } from "app/providers/ILogger";
import { IGetAllTeamsUseCase, IJoinTeamUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
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
        private _logger: ILogger
    ) { }

    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { filters } = httpRequest.params;

        this._logger.info(`[TeamController] getAllTeamswith filters → managerId=${filters}`);

        const result = await this._getAllTeamsUsecase.execute(filters);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Teams fetched successfully", result));
    };

    joinTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { teamId, playerId } = httpRequest.body;

        this._logger.info(`[TeamController] Join to team Id → managerId=${playerId}`);

        const result = await this._joinTeamsUsecase.execute(teamId, playerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Joined to team successfully", result));
    }

}