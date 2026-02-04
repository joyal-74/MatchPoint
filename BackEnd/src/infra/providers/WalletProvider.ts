import { inject } from "tsyringe";
import { IPaymentProvider, PaymentSession } from "../../app/providers/IPaymentProvider.js";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { IWalletRepository } from "../../app/repositories/interfaces/shared/IWalletRepository.js";
import { IRegistrationRepository } from "../../app/repositories/interfaces/manager/IRegistrationRepository.js";
import { PaymentMetadata, TournamentPaymentMetadata } from "../../app/repositories/interfaces/IBasePaymentMetaData.js";
import { BadRequestError, NotFoundError } from "../../domain/errors/index.js";


export class WalletProvider implements IPaymentProvider {
    constructor(
        @inject(DI_TOKENS.WalletProvider) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository
    ) { }

    async createPaymentSession(amount: number, currency: string, teamName: string, metadata: PaymentMetadata): Promise<PaymentSession> {
        if (metadata.type !== "tournament") {
            throw new BadRequestError("Wallet payments only supported for tournament registrations");
        }

        const userId = metadata.managerId;

        const wallet = await this._walletRepo.getByOwner(userId, 'USER');
        if (!wallet) throw new NotFoundError('Wallet not found for this user');

        const deductionAmount = amount / 100;

        if (wallet.balance < deductionAmount) {
            throw new BadRequestError('Insufficient wallet balance');
        }

        const sessionId = `wallet-${Date.now()}`;

        await this._walletRepo.debit(wallet.id, deductionAmount);

        return { sessionId, url: '' };
    }

    async verifyPayment(sessionId: string): Promise<{
        status: 'pending' | 'completed' | 'failed';
        paymentId: string;
        metadata: PaymentMetadata
    }> {
        const registration = await this._registrationRepo.findByPaymentId(sessionId);
        if (!registration) throw new NotFoundError('Registration not found');

        const metadata: TournamentPaymentMetadata = {
            type: "tournament",
            tournamentId: registration.tournamentId,
            teamId: registration.teamId,
            captainId: registration.captainId,
            managerId: registration.managerId,
        };

        return {
            status: registration.paymentStatus as 'pending' | 'completed' | 'failed',
            paymentId: sessionId,
            metadata
        };
    }
}
