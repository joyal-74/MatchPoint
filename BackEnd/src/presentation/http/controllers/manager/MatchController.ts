import { ILogger } from "app/providers/ILogger";
import { ISaveMatchData } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchPlayerServices } from "app/services/manager/IMatchPlayerService";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class MatchController {
    constructor(
        private _matchDetailsService: IMatchPlayerServices,
        private _saveMatchData: ISaveMatchData,
        private _logger: ILogger,
    ) { }

    getMatchDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;

        const result = await this._matchDetailsService.getMatchDashboard(matchId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Match fetched', result));
    }


    saveMatchData = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;
        const { tossWinnerId, tossDecision } = httpRequest.body;

        const result = await this._saveMatchData.execute(matchId, tossWinnerId, tossDecision);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Match saved', result));
    }
}