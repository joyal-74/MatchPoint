import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../../domain/constants/Identifiers.js";
import { IGetTournamentFixtures } from "../../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { IFixturesRepository } from "../../../../repositories/interfaces/manager/IFixturesRepository.js";
import { ILogger } from "../../../../providers/ILogger.js";
import { BadRequestError, NotFoundError } from "../../../../../domain/errors/index.js";
import { Fixture } from "../../../../../domain/entities/Fixture.js";


@injectable()
export class GetTournamentFixtures implements IGetTournamentFixtures {
    constructor(
        @inject(DI_TOKENS.FixturesRepository) private _fixturesRepo: IFixturesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Fixture> {
        if (!tournamentId) {
            this._logger.warn("Tournament ID not provided in GetTournamentFixtures");
            throw new BadRequestError("Tournament ID is required");
        }

        const fixtures = await this._fixturesRepo.getFixtureByTournament(tournamentId);

        if (!fixtures) {
            this._logger.info(`No fixtures found for tournament ${tournamentId}`);
            throw new NotFoundError("No fixtures found for this tournament");
        }

        this._logger.info(`Fetched fixtures for tournament ${tournamentId}`);

        return fixtures;
    }
}