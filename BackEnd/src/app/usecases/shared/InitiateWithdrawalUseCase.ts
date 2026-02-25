import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository";
import { IWalletRepository } from "../../repositories/interfaces/shared/IWalletRepository";
import { IPayoutProvider } from "../../providers/IPayoutProvider";
import { SavePayoutMethodPayload } from "../../../domain/types/financialTypes";
import { PayoutMethodResolver } from "../../../infra/providers/PayoutMethodResolver";
import { IInitiateWithdrawalUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases";


@injectable()
export class InitiateWithdrawalUseCase implements IInitiateWithdrawalUseCase {
    constructor(
        @inject(DI_TOKENS.PayoutProvider) private _payoutProvider: IPayoutProvider,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.PayoutMethodResolver) private _resolver: PayoutMethodResolver
    ) { }

    async execute(userId: string, payoutData: string | SavePayoutMethodPayload, amount: number) {
        const { externalId, method } = await this._resolver.resolve(userId, payoutData);

        const wallet = await this._walletRepo.getByOwner(userId, 'USER');
        if (wallet.balance < amount) throw new Error("Insufficient funds");

        await this._walletRepo.debit(wallet.id, amount);

        const payout = await this._payoutProvider.sendMoney({
            fundAccountId: externalId,
            amount,
            referenceId: `tx_${Date.now()}`,
            type: method.type
        });

        return await this._transactionRepo.create({
            type: 'WITHDRAWAL',
            amount,
            status: (payout.status === 'processed') ? 'SUCCESS' : 'PENDING',
            paymentRefId: payout.payoutId,
            fromWalletId: wallet.id,
            toWalletId: null,
            metadata: {
                description: `Withdrawal to ${method.type}: ${method.detail}`
            }
        });
    }
}
