import { ILogger } from "app/providers/ILogger";
import { IPaymentProvider } from "app/providers/IPaymentProvider";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IInitiateTournamentPayment, ITournamentRegistrationValidator } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { IUnitOfWork } from "app/repositories/interfaces/shared/IUnitOfWork";
import { TransactionService } from "infra/services/TransactionService";
import { BadRequestError, NotFoundError } from "domain/errors";
import { Tournament } from "domain/entities/Tournaments";

export class InitiateTournamentPayment implements IInitiateTournamentPayment {
    private providers: Record<string, IPaymentProvider>;

    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _registrationRepo: IRegistrationRepository,
        private _logger: ILogger,
        private _razorpayProvider: IPaymentProvider,
        private _validator: ITournamentRegistrationValidator,
        private _transactionService: TransactionService,
        private _uow: IUnitOfWork
    ) {
        this.providers = {
            razorpay: _razorpayProvider,
        };
    }

    async execute(tournamentId: string, teamId: string, captainId: string, managerId: string, paymentMethod: string) {
        const tournament = await this._tournamentRepo.findById(tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        const existingRegistration = await this._registrationRepo.findByTournamentAndTeam(tournamentId, teamId);
        if (existingRegistration && existingRegistration.paymentStatus === 'completed') {
            throw new BadRequestError('Team already registered');
        }

        await this._validator.execute(tournamentId, teamId);

        const entryFee = parseFloat(tournament.entryFee);
        if (isNaN(entryFee) || entryFee < 0) throw new BadRequestError('Invalid entry fee');

        if (paymentMethod === 'wallet') {
            return this.handleWalletPayment(tournament, teamId, captainId, managerId, entryFee);
        } else {
            return this.handleExternalPayment(tournament, teamId, captainId, managerId, entryFee, paymentMethod);
        }
    }

    // --- SCENARIO A: Atomic Wallet Transaction ---
    private async handleWalletPayment(tournament: Tournament, teamId: string, captainId: string, managerId: string, amount: number) {
        await this._uow.begin();
        const ctx = this._uow.getContext();

        try {

            await this._transactionService.chargeEntryFee({
                playerUserId: managerId,
                tournamentId: tournament._id,
                amount: amount,
                description: `Entry Fee for ${tournament.title}`
            }, ctx);

            const registration = await this._registrationRepo.create({
                tournamentId: tournament._id,
                teamId,
                captainId,
                managerId,
                paymentStatus: 'completed',
                paymentId: `WALLET_${Date.now()}`,
            }, ctx);

            await this._uow.commit();

            this._logger.info(`Wallet registration successful for team ${teamId}`);

            return {
                status: 'SUCCESS',
                paymentMethod: 'wallet',
                registrationId: registration._id,
                message: 'Registration successful'
            };

        } catch (error) {
            await this._uow.rollback();
            this._logger.error(`Wallet registration failed: ${error}`);
            throw error;
        }
    }

    // --- SCENARIO B: External Payment ---
    private async handleExternalPayment(tournament: Tournament, teamId: string, captainId: string, managerId: string, amount: number, providerName: string) {
        const provider = this.providers[providerName];
        if (!provider) throw new BadRequestError('Invalid payment method');

        let registration = await this._registrationRepo.findByTournamentAndTeam(tournament._id, teamId);

        if (!registration) {
            registration = await this._registrationRepo.create({
                tournamentId: tournament._id,
                teamId,
                captainId,
                managerId,
                paymentStatus: 'pending',
                paymentId: null,
            });
        }

        // 2. Generate Payment Link
        const paymentSession = await provider.createPaymentSession(
            amount,
            'INR',
            `Tournament Entry - ${tournament.title}`,
            {
                teamId,
                captainId,
                managerId,
                tournamentId: tournament._id,
                type: "tournament"
            }
        );

        this._logger.info(`Payment session ${paymentSession.sessionId} created for registration ${registration?._id}`);

        return {
            status: 'PENDING',
            paymentMethod: providerName,
            registrationId: registration?._id,
            paymentUrl: paymentSession.url,
            paymentSessionId: paymentSession.sessionId,
            orderId: paymentSession.orderId,
            keyId: paymentSession.keyId,
        };
    }
}