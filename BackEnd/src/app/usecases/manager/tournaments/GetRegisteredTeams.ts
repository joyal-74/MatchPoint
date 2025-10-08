import { ILogger } from "app/providers/ILogger";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IGetRegisteredTeams } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { TournamentTeam } from "domain/entities/Tournaments";
import { BadRequestError } from "domain/errors";

export class GetRegisteredTeams implements IGetRegisteredTeams {
    constructor(
        private _registeredTeamRepo: IRegistrationRepository,
        private _logger: ILogger,
    ) { }

    async execute(tournamentId: string): Promise<TournamentTeam[]> {
        if (!tournamentId) {
            throw new BadRequestError("Tournament ID is required");
        }

        const registeredTeams = await this._registeredTeamRepo.getTeamsByTournament(tournamentId);
        console.log(registeredTeams)

        // Log the action
        this._logger.info(`Fetched ${registeredTeams.length} teams for tournament ${tournamentId}`);

        return registeredTeams;
    }
}