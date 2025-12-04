import { IAddRunsUseCase, IAddWicketUseCase, IInitInningsUseCase, ISetBowlerUseCase, ISetNonStrikerUseCase, ISetStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchScoreService } from "app/services/manager/IMatchScoreService";

export class MatchScoreService implements IMatchScoreService {

    constructor(
        private _initInningsUseCase: IInitInningsUseCase,
        private _addRunsUseCase: IAddRunsUseCase,
        private _setStrikerUseCase: ISetStrikerUseCase,
        private _setNonStrikerUseCase: ISetNonStrikerUseCase,
        private _setBowlerUseCase: ISetBowlerUseCase,
        private _addWicketUseCase: IAddWicketUseCase
    ) { }

    async initInnings(matchId: string) {
        const match = await this._initInningsUseCase.execute(matchId);
        console.log(match)
        return match;
    }

    async setStriker(matchId: string, batsmanId: string) {
        const match = await this._setStrikerUseCase.execute(matchId, batsmanId)
        return match;
    }

    async setNonStriker(matchId: string, batsmanId: string) {
        const match = await this._setNonStrikerUseCase.execute(matchId, batsmanId)
        return match;
    }

    async setBowler(matchId: string, bowlerId: string) {
        const match = await this._setBowlerUseCase.execute(matchId, bowlerId)
        return match;
    }

    async addRuns(matchId: string, runs: number) {
        const match = await this._addRunsUseCase.execute({ matchId, runs })
        return match;
    }

    async addWicket(matchId: string, dismissalType: string, nextBatsmanId: string) {
        const match = await this._addWicketUseCase.execute({ matchId, dismissalType, nextBatsmanId })
        return match;
    }
}
