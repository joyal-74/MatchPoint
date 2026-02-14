import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ITransactionRepository } from "../../repositories/interfaces/shared/ITransactionRepository.js";
import { IWalletRepository } from "../../repositories/interfaces/shared/IWalletRepository.js";
import { IHandlePayoutWebhookUseCase } from "../../repositories/interfaces/usecases/IFinancialUseCases.js";

export interface RazorpayPayoutEntity {
    id: string;
    amount: number;
    status: string;
    reference_id: string;
}

@injectable()
export class HandlePayoutWebhookUseCase implements IHandlePayoutWebhookUseCase {
    constructor(
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository
    ) { }

    async execute(event: string, payout: RazorpayPayoutEntity) {
        const payoutId = payout.id;
        const amountInRupees = payout.amount / 100;

        switch (event) {
            case 'payout.processed': {
                return await this._transactionRepo.update(payoutId, { status: 'SUCCESS' });
            }

            case 'payout.reversed':
            case 'payout.failed':
            case 'payout.rejected': {
                const tx = await this._transactionRepo.findByPaymentRef(payoutId);

                if (tx && tx.status !== 'FAILED' && tx.toWalletId) {
                    await this._transactionRepo.update(payoutId, { status: 'FAILED' });

                    const walletIdString = tx.toWalletId.toString();

                    await this._walletRepo.credit(walletIdString, amountInRupees);
                }
                break;
            }
        }
    }
}