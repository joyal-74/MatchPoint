import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IInitInningsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { InitInningsPayload, MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class InitInningsUseCase implements IInitInningsUseCase {
    constructor(private matchRepo: IMatchRepo) { }

    async execute(payload: InitInningsPayload): Promise<MatchEntity | null> {
        const match = await this.matchRepo.findByMatchId(payload.matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.initInnings({
            oversLimit: payload.oversLimit,
            strikerId: payload.strikerId,
            nonStrikerId: payload.nonStrikerId,
            bowlerId: payload.bowlerId,
            battingTeamId: payload.battingTeamId,
            bowlingTeamId: payload.bowlingTeamId
        });

        const saved = await this.matchRepo.save(match);
        return saved;
    }
}