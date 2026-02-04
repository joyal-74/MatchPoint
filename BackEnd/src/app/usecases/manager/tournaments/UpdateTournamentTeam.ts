import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IUpdateTournamentTeam } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { IRegistrationRepository } from "../../../repositories/interfaces/manager/IRegistrationRepository.js";
import { IWalletRepository } from "../../../repositories/interfaces/shared/IWalletRepository.js";
import { ITransactionRepository } from "../../../repositories/interfaces/shared/ITransactionRepository.js";
import { IManagerRepository } from "../../../repositories/interfaces/manager/IManagerRepository.js";
import { ILogger } from "../../../providers/ILogger.js";
import { Tournament } from "../../../../domain/entities/Tournaments.js";
import { NotFoundError } from "../../../../domain/errors/index.js";
import { Wallet } from "../../../../domain/entities/Wallet.js";
import { Registration } from "../../../../domain/entities/Registration.js";


@injectable()
export class UpdateTournamentTeam implements IUpdateTournamentTeam {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
