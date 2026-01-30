import { IPaymentProvider, PaymentSession } from "app/providers/IPaymentProvider";
import { IWalletRepository } from "app/repositories/interfaces/shared/IWalletRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { BadRequestError, NotFoundError } from "domain/errors";
import { PaymentMetadata, TournamentPaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";

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
        
        // Use wallet._id (string) to perform the debit
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

        // Construct metadata with the strict literal "tournament"
        const metadata: TournamentPaymentMetadata = {
            type: "tournament", // Hardcoded literal satisfies the union
            tournamentId: registration.tournamentId,
            teamId: registration.teamId,
            captainId: registration.captainId,
            managerId: registration.managerId, // Fixed typo: was captainId
        };

        return {
            status: registration.paymentStatus as 'pending' | 'completed' | 'failed',
            paymentId: sessionId,
            metadata
        };
    }
}