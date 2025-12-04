import { ILogger } from "app/providers/ILogger";
import { IGetLiveScoreUseCase, ISaveMatchData } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchPlayerServices } from "app/services/manager/IMatchPlayerService";
import { IMatchScoreService } from "app/services/manager/IMatchScoreService";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export class MatchController {
    constructor(
        private _matchDetailsService: IMatchPlayerServices,
        private _matchScoreService: IMatchScoreService,
        private _saveMatchData: ISaveMatchData,
        private _getLiveScoreUseCase: IGetLiveScoreUseCase,
        private _logger: ILogger,
    ) { }

    getMatchDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;

        const result = await this._matchDetailsService.getMatchDashboard(matchId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Match fetched', result));
    }

    getLiveScore = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;

        const result = await this._getLiveScoreUseCase.execute(matchId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Match fetched', result));
    }


    saveMatchData = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;
        const { tossWinnerId, tossDecision } = httpRequest.body;

        const result = await this._saveMatchData.execute(matchId, tossWinnerId, tossDecision);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, 'Match saved', result));
    }

    setStriker = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, batsmanId } = httpRequest.body;
        console.log(httpRequest.body)

        const result = await this._matchScoreService.setStriker(matchId, batsmanId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Striker set", result)
        );
    }

    setNonStriker = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, batsmanId } = httpRequest.body;

        const result = await this._matchScoreService.setNonStriker(matchId, batsmanId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Non-striker set", result)
        );
    }

    setBowler = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, bowlerId } = httpRequest.body;

        const result = await this._matchScoreService.setBowler(matchId, bowlerId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Bowler set", result)
        );
    }

    addRuns = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, runs } = httpRequest.body;

        const result = await this._matchScoreService.addRuns(matchId, runs);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, `${runs} Runs added`, result)
        );
    }

    addWicket = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, dismissalType, nextBatsmanId } = httpRequest.body;

        const result = await this._matchScoreService.addWicket(
            matchId,
            dismissalType,
            nextBatsmanId
        );

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Wicket added", result)
        );
    }

    initInnings = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.body;

        const result = await this._matchScoreService.initInnings(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Innings initialized", result)
        );
    };

}