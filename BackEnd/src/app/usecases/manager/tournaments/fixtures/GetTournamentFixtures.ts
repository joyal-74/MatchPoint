import { ILogger } from "app/providers/ILogger";
import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import { IGetTournamentFixtures } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Fixture } from "domain/entities/Fixture";
import { BadRequestError, NotFoundError } from "domain/errors";

export class GetTournamentFixtures implements IGetTournamentFixtures {
    constructor(
        private _fixturesRepo: IFixturesRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Fixture> {
        if (!tournamentId) {
            this._logger.warn("Tournament ID not provided in GetTournamentFixtures");
            throw new BadRequestError("Tournament ID is required");
        }

        const fixtures = await this._fixturesRepo.findByTournamentId(tournamentId);

        if (!fixtures) {
            this._logger.info(`No fixtures found for tournament ${tournamentId}`);
            throw new NotFoundError("No fixtures found for this tournament");
        }

        this._logger.info(`Fetched fixtures for tournament ${tournamentId}`);

        return fixtures;
    }
}