import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

import { ITransactionService } from "../../app/repositories/interfaces/player/ITransactionService.js";
import { ITransactionRepository } from "../../app/repositories/interfaces/shared/ITransactionRepository.js";
import { IUnitOfWork } from "../../app/repositories/interfaces/shared/IUnitOfWork.js";
import { IWalletRepository } from "../../app/repositories/interfaces/shared/IWalletRepository.js";
import { ChargeEntryFeeDTO } from "../../domain/dtos/Transaction.dto.js";
import { ConcurrencyError } from "../../domain/errors/index.js";

@injectable()
export class TransactionService implements ITransactionService {
    constructor(
        @inject(DI_TOKENS.WalletRepository) private walletRepo: IWalletRepository,
        @inject(DI_TOKENS.TransactionRepository) private transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.UnitOfWork) private uow: IUnitOfWork
    ) { }

    async chargeEntryFee(dto: ChargeEntryFeeDTO, ctx?: unknown): Promise<void> {
        if (ctx) {
            await this.executeCharge(dto, ctx);
            return;
        }

        await this.runWithRetries(dto);
    }

    private async runWithRetries(dto: ChargeEntryFeeDTO) {
        const MAX_RETRIES = 3;
        let attempt = 0;
        while (true) {
            try {
                await this.uow.begin();
                const ctx = this.uow.getContext();

                await this.executeCharge(dto, ctx);

                await this.uow.commit();
                return;
            } catch (err) {
                await this.uow.rollback();
                if (err instanceof ConcurrencyError && attempt < MAX_RETRIES) {
                    attempt++;
                    await new Promise(r => setTimeout(r, 100 * attempt));
                    continue;
                }
                throw err;
            }
        }
    }

    private async getOrCreateWallet(ownerId: string, type: 'USER' | 'TOURNAMENT', ctx: unknown) {
        try {
            return await this.walletRepo.getByOwner(ownerId, type, ctx);
        } catch {
            return await this.walletRepo.create({
                ownerId,
                ownerType: type,
                balance: 0,
                currency: 'INR',
                isFrozen : false
            }, ctx);
        }
    }


    private async executeCharge({ playerUserId, tournamentId, amount, description }: ChargeEntryFeeDTO, ctx: unknown) {
        const playerWallet = await this.getOrCreateWallet(playerUserId, 'USER', ctx);

        console.log(playerWallet, '??????')

        const existingTxn = await this.transactionRepo.exists({
            metadata: {
                tournamentId: tournamentId
            },
            fromWalletId: playerWallet.id,
            type: 'ENTRY_FEE',
            status: 'SUCCESS'
        }, ctx);

        if (existingTxn) {
            throw new Error('User has already paid the entry fee for this tournament.');
        }

        if (playerWallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const tournamentWallet = await this.walletRepo.getByOwner(tournamentId, 'TOURNAMENT', ctx);

        await this.transactionRepo.create({
            type: 'ENTRY_FEE',
            fromWalletId: playerWallet.id,
            toWalletId: tournamentWallet.id,
            amount,
            status: 'SUCCESS',
            metadata: { tournamentId, description }
        }, ctx);

        await this.walletRepo.debit(playerWallet.id, amount, ctx);

        await this.walletRepo.credit(tournamentWallet.id, amount, ctx);
    }
}
