import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IEndMatchUseCase, IGetLiveScoreUseCase, ISaveMatchData, IStartMatchUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchPlayerServices } from "app/services/manager/IMatchPlayerService";
import { IMatchScoreService } from "app/services/manager/IMatchScoreService";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

@injectable()
export class MatchController {
    constructor(
        @inject(DI_TOKENS.MatchPlayerServices) private _matchDetailsService: IMatchPlayerServices,
        @inject(DI_TOKENS.MatchScoreService) private _matchScoreService: IMatchScoreService,
        @inject(DI_TOKENS.SaveMatchData) private _saveMatchData: ISaveMatchData,
        @inject(DI_TOKENS.StartMatchUseCase) private _startMatchData: IStartMatchUseCase,
        @inject(DI_TOKENS.GetLiveScoreUseCase) private _getLiveScoreUseCase: IGetLiveScoreUseCase,
        @inject(DI_TOKENS.EndMatchUseCase) private _endMatchUseCase: IEndMatchUseCase,
    ) { }

    /**
     * ---------------------------
     * @route GET /matches/:matchId
     * @description Fetch full match dashboard data
     * @returns Match summary including players, teams, stats
     * ---------------------------
     */
    getMatchDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;
        const result = await this._matchDetailsService.getMatchDashboard(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Match fetched', result)
        );
    };

    /**
     * ---------------------------
     * @route GET /matches/live/:matchId
     * @description Fetch live scorecard with real-time ball-by-ball data
     * ---------------------------
     */
    getLiveScore = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;

        const result = await this._getLiveScoreUseCase.execute(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Match fetched', result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/:matchId/save
     * @description Save toss details (toss winner + decision)
     * ---------------------------
     */
    saveMatchData = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const matchId = httpRequest.params.matchId;
        const { tossWinnerId, tossDecision } = httpRequest.body;

        const result = await this._saveMatchData.execute(matchId, tossWinnerId, tossDecision);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Match saved', result)
        );
    };

    startMatchData = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.body;

        const result = await this._startMatchData.execute(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, 'Match started', result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/striker
     * @description Set current striker batsman
     * ---------------------------
     */
    setStriker = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, batsmanId } = httpRequest.body;

        const result = await this._matchScoreService.setStriker(matchId, batsmanId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Striker set", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/non-striker
     * @description Set current non-striker batsman
     * ---------------------------
     */
    setNonStriker = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, batsmanId } = httpRequest.body;

        const result = await this._matchScoreService.setNonStriker(matchId, batsmanId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Non-striker set", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/bowler
     * @description Set current bowler for the over
     * ---------------------------
     */
    setBowler = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, bowlerId } = httpRequest.body;

        const result = await this._matchScoreService.setBowler(matchId, bowlerId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Bowler set", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/add-runs
     * @description Add normal runs to the current ball
     * ---------------------------
     */
    addRuns = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, runs } = httpRequest.body;

        const result = await this._matchScoreService.addRuns(matchId, runs);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, `${runs} Runs added`, result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/wicket
     * @description Register a wicket event
     * @details Supports bowled, caught, run-out, lbw, stumped, etc.
     * ---------------------------
     */
    addWicket = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const {
            matchId,
            dismissalType,
            outBatsmanId,
            nextBatsmanId,
            isLegalBall,
            fielderId
        } = httpRequest.body;

        const result = await this._matchScoreService.addWicket(
            matchId,
            dismissalType,
            outBatsmanId,
            nextBatsmanId,
            isLegalBall,
            fielderId
        );

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Wicket added", result)
        );
    };

    /**
     * ---------------------------
     * @route POST /matches/init-innings
     * @description Initialize the innings with striker, non-striker, bowler, teams, overs limit
     * ---------------------------
     */
    initInnings = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const payload = httpRequest.body;

        const result = await this._matchScoreService.initInnings(payload);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Innings initialized", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/extras
     * @description Add wides, no-balls, byes, leg-byes
     * ---------------------------
     */
    addExtras = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, type, runs } = httpRequest.body;

        const result = await this._matchScoreService.addExtras(matchId, type, runs);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Extras added", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/:matchId/undo-ball
     * @description Undo last ball (revert runs, wicket, bowler stats, batsman stats)
     * ---------------------------
     */
    undoLastBall = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.params;

        const result = await this._matchScoreService.undoLastBall(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Last ball undone", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/:matchId/super-over
     * @description Starts Super Over and resets all necessary fields
     * ---------------------------
     */
    startSuperOver = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.params;

        const result = await this._matchScoreService.startSuperOver(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Super Over started", result)
        );
    };

    // =========================================================================
    // NEW CONTROLLER METHODS ADDED BELOW
    // =========================================================================

    /**
     * ---------------------------
     * @route PATCH /matches/end-over
     * @description Manually end the current over
     * ---------------------------
     */
    endOver = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.body;

        const result = await this._matchScoreService.endOver(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Over ended", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/end-innings
     * @description End the current innings and switch/complete match
     * ---------------------------
     */
    endInnings = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId } = httpRequest.body;

        const result = await this._matchScoreService.endInnings(matchId);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Innings ended", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/penalty
     * @description Add penalty runs (e.g. 5 runs for hitting helmet)
     * ---------------------------
     */
    addPenalty = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, runs } = httpRequest.body;

        const result = await this._matchScoreService.addPenalty(matchId, runs);

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Penalty added", result)
        );
    };

    /**
     * ---------------------------
     * @route PATCH /matches/retire
     * @description Retire a batsman (Hurt or Out)
     * ---------------------------
     */
    retireBatsman = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { matchId, outBatsmanId, newBatsmanId, isRetiredHurt } = httpRequest.body;

        const result = await this._matchScoreService.retireBatsman(
            matchId,
            outBatsmanId,
            newBatsmanId,
            isRetiredHurt
        );

        return new HttpResponse(
            HttpStatusCode.OK,
            buildResponse(true, "Batsman retired", result)
        );
    };


    endMatch = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { input } = httpRequest.body;

        const result = await this._endMatchUseCase.execute(input);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Match ended", result));
    };
}