import { ILogger } from "app/providers/ILogger";
import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ICreateTournamentFixtures } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Fixture } from "domain/entities/Fixture";
import { BadRequestError, NotFoundError } from "domain/errors";

export class CreateTournamentFixtures implements ICreateTournamentFixtures {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _fixturesRepo: IFixturesRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string, data: Fixture): Promise<Fixture> {
        if (!tournamentId) {
            this._logger.warn("Tournament ID not provided");
            throw new BadRequestError("Tournament ID is required");
        }
        if (!data) {
            this._logger.warn("No fixture data provided");
            throw new BadRequestError("At least one fixture is required");
        }

        const tournament = await this._tournamentRepo.findById(tournamentId);
        if (!tournament) {
            this._logger.warn(`Tournament not found: ${tournamentId}`);
            throw new NotFoundError("Tournament not found");
        }

        const existingFixtures = await this._fixturesRepo.findByTournamentId(tournamentId);
        console.log("-----", existingFixtures)
        if (existingFixtures) {
            this._logger.warn(`Fixtures already exist for tournament ${tournamentId}`);
            throw new BadRequestError("Fixtures already created for this tournament");
        }

        const createdFixtures = await this._fixturesRepo.createFixture(tournamentId, data);

        this._logger.info(`Created fixtures for tournament ${tournamentId}`);

        return createdFixtures;
    }
}
