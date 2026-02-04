import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { InitInningsPayload, MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { NotFoundError } from "../../../../domain/errors/index.js";
import { IInitInningsUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";


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
