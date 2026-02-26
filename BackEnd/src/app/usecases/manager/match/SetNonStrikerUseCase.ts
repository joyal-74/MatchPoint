import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { NotFoundError } from "../../../../domain/errors/index";
import { ISetNonStrikerUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";


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
