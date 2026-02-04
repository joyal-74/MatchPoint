import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { IWalletRepository } from "../../app/repositories/interfaces/shared/IWalletRepository.js";
import { ILogger } from "../../app/providers/ILogger.js";
import { IRegistrationRepository } from "../../app/repositories/interfaces/manager/IRegistrationRepository.js";
import { ITournamentRefundService } from "../../app/services/manager/ITournamentServices.js";
import { ITransactionRepository } from "../../app/repositories/interfaces/shared/ITransactionRepository.js";
import { TransactionStatus, TransactionType } from "../../domain/dtos/Transaction.dto.js";

@injectable()
export class TournamentRefundService implements ITournamentRefundService {
    constructor(
        @inject(DI_TOKENS.RegistrationRepository) private _registeredTeamRepo: IRegistrationRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) {}

    async processFullRefunds(tournamentId: string, entryFee: string, reason: string): Promise<void> {
        const feeAmount = Number(entryFee);
        
        // 1. Validation check
        if (isNaN(feeAmount) || feeAmount <= 0) return;

        const registeredTeams = await this._registeredTeamRepo.getTeamsByTournament(tournamentId);
        
        if (!registeredTeams.length) {
            this._logger.info(`[RefundService] No teams to refund for tournament ${tournamentId}`);
            return;
        }

        this._logger.info(`[RefundService] Processing refunds for ${registeredTeams.length} teams.`);

        await Promise.all(registeredTeams.map(async (team) => {
            if (team.paymentStatus === 'completed') {
                try {
                    const wallet = await this._walletRepo.getByOwner(team.managerId, 'USER');

                    if (!wallet) {
                        this._logger.error(`[RefundService] Wallet not found for captain ${team.captain}`);
                        return;
                    }

                    await this._walletRepo.credit(wallet.id, feeAmount);

                    await this._transactionRepo.create({
                        type: 'REFUND' as TransactionType,
                        amount: feeAmount,
                        toWalletId: wallet.id,
                        status: 'COMPLETED' as TransactionStatus,
                        paymentProvider: 'INTERNAL',
                        metadata: {
                            tournamentId: tournamentId,
                            description: `Refund: Tournament cancelled. Reason: ${reason}`,
                            teamId: team._id
                        }
                    });

                    this._logger.info(`[RefundService] Successfully refunded ${feeAmount} to user ${team.managerId}`);

                } catch (error) {
                    console.log(error)
                    this._logger.error(`[RefundService] Failed to refund user ${team.managerId}`);
                }
            }
        }));
    }
}
