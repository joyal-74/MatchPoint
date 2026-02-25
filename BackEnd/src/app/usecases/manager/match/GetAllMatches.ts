import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IGetAllMatches } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchesRepository } from "../../../repositories/interfaces/manager/IMatchesRepository";
import { Match } from "../../../../domain/entities/Match";
import { ILogger } from "../../../providers/ILogger";


@injectable()
export class GetAllMatches implements IGetAllMatches {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepository: IMatchesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(search: string, limit: number = 10, page: number = 1, status: string): Promise<{ matches: Match[], totalPages: number }> {

        this._logger.info(`Executing GetAllMatches with params: search="${search}", status="${status}", page=${page}, limit=${limit}`);

        const { matches, totalPages } = await this._matchRepository.findAllMatches({ search, limit, page, status });

        this._logger.info(`Successfully fetched ${matches.length} matches. Total pages: ${totalPages}`);

        return { matches, totalPages };
    }
}
