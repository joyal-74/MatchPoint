import { ILogger } from "app/providers/ILogger";
import { IPaymentProvider } from "app/providers/IPaymentProvider";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IInitiateTournamentPayment } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";


export class InitiateTournamentPayment implements IInitiateTournamentPayment {
    private providers: Record<string, IPaymentProvider>;

    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _registrationRepo: IRegistrationRepository,
        private _logger: ILogger,
        private _razorpayProvider: IPaymentProvider,
        private _walletProvider: IPaymentProvider
    ) {
        this.providers = {
            razorpay: _razorpayProvider,
            wallet: _walletProvider,
        };
    }

    async execute(tournamentId: string, teamId: string, captainId: string, managerId:string, paymentMethod: string) {
        const tournament = await this._tournamentRepo.findById(tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');


        const existingRegistration = await this._registrationRepo.findByTournamentAndTeam(tournamentId, teamId);
        if (existingRegistration) throw new BadRequestError('Team already registered');

        const entryFee = parseFloat(tournament.entryFee);
        if (isNaN(entryFee) || entryFee <= 0) throw new BadRequestError('Invalid entry fee');


        const registration = await this._registrationRepo.create({
            tournamentId,
            teamId,
            captainId,
            managerId,
            paymentStatus: 'pending',
            paymentId: null,
        });

        const provider = this.providers[paymentMethod];
        if (!provider) throw new BadRequestError('Invalid payment method');

        const paymentSession = await provider.createPaymentSession(
            entryFee * 100,
            'INR',
            `Tournament Entry - ${tournament.title}`,
            { tournamentId, teamId, captainId, managerId }
        );

        if (paymentMethod === 'wallet') {
            await this._registrationRepo.updatePaymentStatus(registration._id, 'completed', paymentSession.sessionId);
        }

        this._logger.info(`Payment session created: ${paymentSession.sessionId} for registration ${registration._id}`);

        return {
            tournament, paymentUrl: paymentSession.url,
            paymentSessionId: paymentSession.sessionId,
            registrationId: registration._id,
            orderId: paymentSession.orderId,
            keyId: paymentSession.keyId,
        };
    }
}