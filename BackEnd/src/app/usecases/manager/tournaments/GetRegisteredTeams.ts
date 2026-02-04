import { inject, injectable } from "tsyringe";
import { IGetRegisteredTeams } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IRegistrationRepository } from "../../../repositories/interfaces/manager/IRegistrationRepository.js";
import { ILogger } from "../../../providers/ILogger.js";
import { BadRequestError } from "../../../../domain/errors/index.js";
import { TournamentTeamData } from "../../../../domain/dtos/Tournament.js";


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
