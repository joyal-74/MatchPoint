import {
    IAddRunsUseCase,
    IAddWicketUseCase,
    IInitInningsUseCase,
    ISetBowlerUseCase,
    ISetNonStrikerUseCase,
    ISetStrikerUseCase,
    IUndoLastBallUseCase,
    IStartSuperOverUseCase,
    IAddExtrasUseCase,
    IEndOverUseCase,
    IEndInningsUseCase,
    IAddPenaltyUseCase,
    IRetireBatsmanUseCase
} from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

import { IMatchScoreService } from "app/services/manager/IMatchScoreService";
import { InitInningsPayload } from "domain/entities/MatchEntity";

export class MatchScoreService implements IMatchScoreService {

    constructor(
        private _initInningsUseCase: IInitInningsUseCase,
        private _addRunsUseCase: IAddRunsUseCase,
        private _setStrikerUseCase: ISetStrikerUseCase,
        private _setNonStrikerUseCase: ISetNonStrikerUseCase,
        private _setBowlerUseCase: ISetBowlerUseCase,
        private _addWicketUseCase: IAddWicketUseCase,
        private _addExtrasUseCase: IAddExtrasUseCase,
        private _undoLastBallUseCase: IUndoLastBallUseCase,
        private _startSuperOverUseCase: IStartSuperOverUseCase,
        private _endOverUseCase: IEndOverUseCase,
        private _endInningsUseCase: IEndInningsUseCase,
        private _addPenaltyUseCase: IAddPenaltyUseCase,
        private _retireBatsmanUseCase: IRetireBatsmanUseCase
    ) { }

    async initInnings(payload: InitInningsPayload) {
        await this._initInningsUseCase.execute(payload);
        return null;
    }

    async setStriker(matchId: string, batsmanId: string) {
        await this._setStrikerUseCase.execute(matchId, batsmanId);
        return null;
    }

    async setNonStriker(matchId: string, batsmanId: string) {
        await this._setNonStrikerUseCase.execute(matchId, batsmanId);
        return null;
    }

    async setBowler(matchId: string, bowlerId: string) {
        await this._setBowlerUseCase.execute(matchId, bowlerId);
        return null;
    }

    async addRuns(matchId: string, runs: number) {
        await this._addRunsUseCase.execute({ matchId, runs });
        return null;
    }

    async addExtras(matchId: string, type: string, runs: number) {
        await this._addExtrasUseCase.execute({ matchId, type, runs });
        return null;
    }

    async addWicket(matchId: string, dismissalType: string, outBatsmanId: string, nextBatsmanId: string, fielderId?: string) {
        await this._addWicketUseCase.execute({
            matchId,
            dismissalType,
            outBatsmanId,
            nextBatsmanId,
            fielderId
        });
        return null;
    }

    async undoLastBall(matchId: string) {
        await this._undoLastBallUseCase.execute(matchId);
        return null;
    }

    async startSuperOver(matchId: string) {
        await this._startSuperOverUseCase.execute(matchId);
        return null;
    }

    async endOver(matchId: string) {
        await this._endOverUseCase.execute(matchId);
        return null;
    }

    async endInnings(matchId: string) {
        await this._endInningsUseCase.execute(matchId);
        return null;
    }

    async addPenalty(matchId: string, runs: number) {
        await this._addPenaltyUseCase.execute(matchId, runs);
        return null;
    }

    async retireBatsman(matchId: string, outBatsmanId: string, newBatsmanId: string, isRetiredHurt: boolean) {
        await this._retireBatsmanUseCase.execute(matchId, outBatsmanId, newBatsmanId, isRetiredHurt);
        return null;
    }
}