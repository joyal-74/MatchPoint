import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

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
    IRetireBatsmanUseCase,
    IEndMatchUseCase
} from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

import { IMatchScoreService } from "app/services/manager/IMatchScoreService";
import { InitInningsPayload } from "domain/entities/MatchEntity";
import { DismissalType } from "domain/entities/Innings";


@injectable()
export class MatchScoreService implements IMatchScoreService {

    constructor(
        @inject(DI_TOKENS.InitInningsUseCase) private _initInningsUseCase: IInitInningsUseCase,
        @inject(DI_TOKENS.AddRunsUseCase) private _addRunsUseCase: IAddRunsUseCase,
        @inject(DI_TOKENS.SetStrikerUseCase) private _setStrikerUseCase: ISetStrikerUseCase,
        @inject(DI_TOKENS.SetNonStrikerUseCase) private _setNonStrikerUseCase: ISetNonStrikerUseCase,
        @inject(DI_TOKENS.SetBowlerUseCase) private _setBowlerUseCase: ISetBowlerUseCase,
        @inject(DI_TOKENS.AddWicketUseCase) private _addWicketUseCase: IAddWicketUseCase,
        @inject(DI_TOKENS.AddExtrasUseCase) private _addExtrasUseCase: IAddExtrasUseCase,
        @inject(DI_TOKENS.UndoLastBallUseCase) private _undoLastBallUseCase: IUndoLastBallUseCase,
        @inject(DI_TOKENS.StartSuperOverUseCase) private _startSuperOverUseCase: IStartSuperOverUseCase,
        @inject(DI_TOKENS.EndOverUseCase) private _endOverUseCase: IEndOverUseCase,
        @inject(DI_TOKENS.EndInningsUseCase) private _endInningsUseCase: IEndInningsUseCase,
        @inject(DI_TOKENS.AddPenaltyUseCase) private _addPenaltyUseCase: IAddPenaltyUseCase,
        @inject(DI_TOKENS.RetireBatsmanUseCase) private _retireBatsmanUseCase: IRetireBatsmanUseCase,
        @inject(DI_TOKENS.EndMatchUseCase) private _endMatchUseCase: IEndMatchUseCase
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

    async addWicket(matchId: string, dismissalType: DismissalType, outBatsmanId: string, nextBatsmanId: string, bowlerId : string, isLegalBall : boolean, fielderId?: string) {
        await this._addWicketUseCase.execute({
            matchId,
            dismissalType,
            bowlerId,
            isLegalBall,
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

    async endMatch(matchId: string, type: "NORMAL" | "ABANDONED" | "NO_RESULT", reason?: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER", notes?: string, endedBy?: string) {
        return await this._endMatchUseCase.execute({ matchId, type, reason, notes, endedBy });
    }
}