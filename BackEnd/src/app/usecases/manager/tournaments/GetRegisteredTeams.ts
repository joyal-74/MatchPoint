import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IGetRegisteredTeams } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { TournamentTeamData } from "domain/dtos/Tournament";
import { BadRequestError } from "domain/errors";

@injectable()
export class GetRegisteredTeams implements IGetRegisteredTeams {
    constructor(
        @inject(DI_TOKENS.RegistrationRepository) private _registeredTeamRepo: IRegistrationRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(tournamentId: string): Promise<TournamentTeamData[]> {
        if (!tournamentId) {
            throw new BadRequestError("Tournament ID is required");
        }

        const registeredTeams = await this._registeredTeamRepo.getTeamsByTournament(tournamentId);

        // Log the action
        this._logger.info(`Fetched ${registeredTeams.length} teams for tournament ${tournamentId}`);

        return registeredTeams;
    }
}