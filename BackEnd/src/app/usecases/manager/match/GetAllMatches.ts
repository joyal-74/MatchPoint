import { injectable, inject } from "tsyringe";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IGetAllMatches } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { DI_TOKENS } from "domain/constants/Identifiers";

@injectable()
export class GetAllMatches implements IGetAllMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchRepository: IMatchStatsRepo
    ) { }

    async execute(search: string, limit: number = 10, page: number = 1): Promise<{ matches: MatchEntity[], totalPages: number }> {

        const { matches, totalPages } = await this._matchRepository.findAllMatches({ search, limit, page });

        return {
            matches,
            totalPages
        };
    }
}