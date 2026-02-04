import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetUmpireAllMatches } from "../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";


@injectable()
export class GetUmpireAllMatches implements IGetUmpireAllMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchRepository: IMatchStatsRepo
    ) { }

    async execute(userId: string, search: string, limit: number = 10, page: number = 1): Promise<{ matches: MatchEntity[], totalPages: number }> {

        const { matches, totalPages } = await this._matchRepository.findAllMatches({ search, limit, page, userId });

        return { matches, totalPages };
    }
}
