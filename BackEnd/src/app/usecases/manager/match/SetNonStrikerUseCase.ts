import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { NotFoundError } from "../../../../domain/errors/index.js";
import { ISetNonStrikerUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";


@injectable()
export class SetNonStrikerUseCase implements ISetNonStrikerUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) {}

    async execute(matchId: string, batsmanId: string) : Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.setCurrentNonStriker(batsmanId);
        const updated = await this._matchStatsRepo.save(match);
        return updated;
    }
}
