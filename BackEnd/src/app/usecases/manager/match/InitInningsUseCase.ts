import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IInitInningsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { InitInningsPayload, MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

@injectable()
export class InitInningsUseCase implements IInitInningsUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
    ) { }

    async execute(payload: InitInningsPayload): Promise<MatchEntity | null> {
        const match = await this._matchStatsRepo.findByMatchId(payload.matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.initInnings({
            oversLimit: payload.oversLimit,
            strikerId: payload.strikerId,
            nonStrikerId: payload.nonStrikerId,
            bowlerId: payload.bowlerId,
            battingTeamId: payload.battingTeamId,
            bowlingTeamId: payload.bowlingTeamId
        });

        const saved = await this._matchStatsRepo.save(match);
        return saved;
    }
}