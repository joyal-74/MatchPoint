import { ILogger } from "app/providers/ILogger";
import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import { ICreateTournamentFixtures } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

export class CreateFixtureUseCase implements ICreateTournamentFixtures {
    constructor(
        private _fixturesRepo: IFixturesRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string) {
        if (!tournamentId) throw new BadRequestError("Tournament ID is required");
        if (!matchIds || matchIds.length === 0) throw new NotFoundError("No match IDs provided");

        const fixture = await this._fixturesRepo.createFixture(tournamentId, matchIds, format);

        this._logger.info(`Created fixture for tournament ${tournamentId}`);
        return fixture;
    }
}