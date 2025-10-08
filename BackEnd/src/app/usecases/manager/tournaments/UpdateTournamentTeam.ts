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
        console.log('--0--0-0-00-',paymentStatus)
        const registration = await this._registrationRepo.updatePaymentStatus(registrationId, paymentStatus, paymentId);
        const tournament = await this._tournamentRepo.findById(registration.tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        this._logger.info(`Registration ${registrationId} payment updated with status ${paymentStatus}`);
        return tournament;
    }
}