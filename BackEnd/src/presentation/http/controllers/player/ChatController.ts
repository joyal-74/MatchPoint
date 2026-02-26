import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { HttpResponse } from "../../helpers/HttpResponse";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { GetChatsUseCase } from "../../../../app/usecases/player/chat/GetChatsUsecase";
import { ILogger } from "../../../../app/providers/ILogger";
import { IGetUserTeamsUseCase } from "../../../../app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { TeamMessages } from "../../../../domain/constants/TeamMessages";

@injectable()
export class ChatController {
    constructor(
        @inject(DI_TOKENS.GetChatsUseCase) private _getChatsUC: GetChatsUseCase,
        @inject(DI_TOKENS.GetUserTeamsUseCase) private _getUserTeamsUsecase: IGetUserTeamsUseCase,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    getMyChats = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const userId = httpRequest.params.userId;

        const data = await this._getChatsUC.execute(userId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "get my chats success", data));
    };

    getAllTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId, role } = httpRequest.params;

        console.log(httpRequest.params)

        this._logger.info(`[TeamController] getAllTeams`);

        const result = await this._getUserTeamsUsecase.execute(userId, role);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, TeamMessages.TEAMS_FETCHED, result));
    };
}
