import type { Match } from "domain/entities/Match";
import { ILogger } from "app/providers/ILogger";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { ICreateMatchesUseCase } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";

export class CreateMatchesUseCase implements ICreateMatchesUseCase {
    constructor(
        private _matchesRepo: IMatchesRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string, matchesData: Match[]): Promise<Match[]> {
        console.log(matchesData, "createdMatches")
        if (!matchesData) {
            this._logger.warn("No matches data provided");
            throw new Error("At least one match is required");
        }

        const createdMatches = await this._matchesRepo.createMatches(tournamentId, matchesData);

        this._logger.info(`Created ${createdMatches.length} matches`);
        return createdMatches;
    }
}