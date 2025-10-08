import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IUpdateTournamentTeam } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";


export class UpdateTournamentTeam implements IUpdateTournamentTeam {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _registrationRepo: IRegistrationRepository,
        private _logger: ILogger
    ) { }

    async execute(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Tournament> {
        const registration = await this._registrationRepo.updatePaymentStatus(registrationId, paymentStatus, paymentId);
        const increment = await this._tournamentRepo.incrementCurrTeams(registration.tournamentId);
        if (increment) {
            this._logger.info(`Tournament ${registration.tournamentId} currTeams incremented`);
        }

        const tournament = await this._tournamentRepo.findById(registration.tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        this._logger.info(`Registration ${registrationId} payment updated with status ${paymentStatus}`);
        return tournament;
    }
}