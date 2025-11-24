import { IPaymentProvider, PaymentMetadata, PaymentSession } from "app/providers/IPaymentProvider";
import { IWalletRepository } from "app/repositories/interfaces/shared/IWalletRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

export class WalletProvider implements IPaymentProvider {
    constructor(
        private _walletRepo: IWalletRepository,
        private _registrationRepo: IRegistrationRepository
    ) { }

    async createPaymentSession(
        amount: number,
        currency: string,
        teamName: string,
        metadata: PaymentMetadata
    ): Promise<PaymentSession> {
        const userId = metadata.managerId;
        const balance = await this._walletRepo.getBalance(userId);
        if (balance < amount / 100) throw new BadRequestError('Insufficient wallet balance');

        const sessionId = `wallet-${Date.now()}`;
        await this._walletRepo.deductBalance(userId, amount / 100);

        return { sessionId, url: '' };
    }

    async verifyPayment(sessionId: string): Promise<{ status: 'pending' |'completed' | 'failed'; paymentId: string; metadata: PaymentMetadata }> {
        const registration = await this._registrationRepo.findByPaymentId(sessionId);
        if (!registration) throw new NotFoundError('Registration not found');
        return {
            status: registration.paymentStatus,
            paymentId: sessionId,
            metadata: {
                tournamentId: registration.tournamentId,
                teamId: registration.teamId,
                captainId: registration.captainId,
                managerId: registration.captainId,
            },
        };
    }
}