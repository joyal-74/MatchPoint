import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IFixturesRepository } from "app/repositories/interfaces/manager/IFixturesRepository";
import { ICreateTournamentFixtures } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

@injectable()
export class CreateFixtureUseCase implements ICreateTournamentFixtures {
    constructor(
        @inject(DI_TOKENS.FixturesRepository) private _fixturesRepo: IFixturesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string) {
        if (!tournamentId) throw new BadRequestError("Tournament ID is required");
        if (!matchIds || matchIds.length === 0) throw new NotFoundError("No match IDs provided");

        const fixture = await this._fixturesRepo.createFixture(tournamentId, matchIds, format);

        this._logger.info(`Created fixture for tournament ${tournamentId}`);
        return fixture;
    }
}