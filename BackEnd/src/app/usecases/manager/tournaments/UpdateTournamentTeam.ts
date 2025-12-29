import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IUpdateTournamentTeam } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { IWalletRepository } from "app/repositories/interfaces/shared/IWalletRepository";
import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";
import { Registration } from "domain/entities/Registration";
import { Wallet } from "domain/entities/Wallet";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";

export class UpdateTournamentTeam implements IUpdateTournamentTeam {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _registrationRepo: IRegistrationRepository,
        private _walletRepo: IWalletRepository,
        private _transactionRepo: ITransactionRepository,
        private _managerRepo: IManagerRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string, registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Tournament> {
        const registration = await this._registrationRepo.updatePaymentStatus(registrationId, paymentStatus, paymentId);

        if (!registration) throw new NotFoundError('Registration not found');

        if (paymentStatus === 'completed') {
            await this.recordExternalPayment(registration, paymentId);

            const increment = await this._tournamentRepo.incrementCurrTeams(registration.tournamentId);
            if (increment) {
                this._logger.info(`Tournament ${registration.tournamentId} currTeams incremented`);
            }
        }


        const tournament = await this._tournamentRepo.findById(registration.tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        await this._managerRepo.joinTournamentUpdate(userId, tournament._id)

        this._logger.info(`Registration ${registrationId} payment updated with status ${paymentStatus}`);
        return tournament;
    }

    private async recordExternalPayment(registration: Registration, paymentRefId: string) {
        const tournament = await this._tournamentRepo.findById(registration.tournamentId);
        if (!tournament) return;

        const amount = parseFloat(tournament.entryFee);

        let tournamentWallet: Wallet;
        try {
            tournamentWallet = await this._walletRepo.getByOwner(registration.tournamentId, 'TOURNAMENT');
        } catch {
            tournamentWallet = await this._walletRepo.create({
                ownerId: registration.tournamentId,
                ownerType: 'TOURNAMENT',
                balance: 0,
                currency: 'INR',
                isFrozen: false
            });
        }

        await this._transactionRepo.create({
            type: 'ENTRY_FEE',
            fromWalletId: null,
            toWalletId: tournamentWallet.id,
            amount: amount,
            status: 'SUCCESS',
            paymentProvider: 'RAZORPAY',
            paymentRefId: paymentRefId,
            metadata: {
                tournamentId: tournament._id,
                registrationId: registration._id,
                description: "Entry Fee via Razorpay"
            }
        });

        await this._walletRepo.credit(tournamentWallet.id, amount);

        this._logger.info(`Recorded external payment of ${amount} for Tournament ${tournament._id}`);
    }
}