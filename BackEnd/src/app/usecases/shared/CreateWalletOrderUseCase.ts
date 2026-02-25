import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IPaymentProvider } from "../../providers/IPaymentProvider";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository";
import { ILogger } from "../../providers/ILogger";
import { WalletPaymentMetadata } from "../../repositories/interfaces/IBasePaymentMetaData"; 
import { ICreateWalletOrderUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases";
import { IWalletRepository } from "../../repositories/interfaces/shared/IWalletRepository";

@injectable()
export class CreateWalletOrderUseCase implements ICreateWalletOrderUseCase {
    constructor(
        @inject(DI_TOKENS.PaymentProvider) private _paymentProvider: IPaymentProvider,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(userId: string, amount: number) {
        this._logger.info(`Initializing wallet deposit: User ${userId}, Amount ₹${amount}`);

        const wallet = await this._walletRepo.getByOwner(userId, 'USER');

        const metadata: WalletPaymentMetadata = {
            type: "wallet",
            userId: userId,
            amount: amount
        };

        const session = await this._paymentProvider.createPaymentSession(
            amount, 
            "INR", 
            "Wallet Deposit", 
            metadata
        );

        await this._transactionRepo.create({
            type: 'DEPOSIT',
            status: 'PENDING',
            toWalletId: wallet.id, 
            amount: amount,
            paymentProvider: 'RAZORPAY',
            paymentRefId: session.orderId,
            metadata: {
                description: "Wallet top-up via Razorpay"
            }
        });

        return {
            id: session.orderId,
            amount: amount * 100, 
            currency: "INR",
            key: session.keyId
        };
    }
}
