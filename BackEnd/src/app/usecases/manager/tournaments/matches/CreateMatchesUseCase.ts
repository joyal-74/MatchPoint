import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../../domain/constants/Identifiers.js";
import { ICreateMatchesUseCase } from "../../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { IMatchesRepository } from "../../../../repositories/interfaces/manager/IMatchesRepository.js";
import { ILogger } from "../../../../providers/ILogger.js";
import { Match } from "../../../../../domain/entities/Match.js";
import { BadRequestError } from "../../../../../domain/errors/index.js";


@injectable()
export class CreateMatchesUseCase implements ICreateMatchesUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tournamentId: string, matchesData: Match[]): Promise<Match[]> {
        console.log(matchesData, "createdMatches")
        if (!matchesData) {
            this._logger.warn("No matches data provided");
            throw new BadRequestError("At least one match is required");
        }

        const createdMatches = await this._matchesRepo.createMatches(tournamentId, matchesData);

        this._logger.info(`Created ${createdMatches.length} matches`);
        return createdMatches;
    }
}
