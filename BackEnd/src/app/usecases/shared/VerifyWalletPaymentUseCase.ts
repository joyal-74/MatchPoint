import crypto from 'crypto';
import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IPaymentProvider } from "../../providers/IPaymentProvider.js";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository.js";
import { IWalletRepository } from "../../repositories/interfaces/shared/IWalletRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { IRazorpayPaymentData } from '../../../domain/types/financialTypes.js';
import { IVerifyWalletPaymentUseCase } from '../../repositories/interfaces/usecases/IFinancialUseCases.js';
import { IConfigProvider } from '../../providers/IConfigProvider.js';

@injectable()
@injectable()
export class VerifyWalletPaymentUseCase implements IVerifyWalletPaymentUseCase {
    constructor(
        @inject(DI_TOKENS.PaymentProvider) private _paymentProvider: IPaymentProvider,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.ConfigProvider) private _config: IConfigProvider,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(data: IRazorpayPaymentData) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = data;

        const secret = this._config.getRazorPaySecret();
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            throw new Error("Invalid signature");
        }

        await this._paymentProvider.verifyPayment(razorpay_payment_id);

        const transaction = await this._transactionRepo.findByPaymentRef(razorpay_order_id);

        if (!transaction || transaction.status !== 'PENDING') {
            throw new Error("Transaction invalid or already processed");
        }

        const wallet = await this._walletRepo.getByOwner(userId, 'USER');

        await this._transactionRepo.markAsSuccess(transaction._id, razorpay_payment_id);
        await this._walletRepo.credit(wallet.id, transaction.amount);

        return { 
            success: true, 
            balance: wallet.balance + transaction.amount 
        };
    }
}