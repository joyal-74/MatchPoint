import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

import { ILogger } from "../../app/providers/ILogger";
import { ISubscriptionRepository } from "../../app/repositories/interfaces/shared/ISubscriptionRepository";
import { IUpdateUserPlan, IVerifyPaymentUseCase } from "../../app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { ISubscriptionService, SubscriptionFinalizeResult } from "../../app/services/ISubscriptionServices";
import { BillingCycle, PlanLevel } from "../../domain/entities/Plan";
import { ITransactionRepository } from "../../app/repositories/interfaces/shared/ITransactionRepository";
import { IWalletRepository } from "../../app/repositories/interfaces/shared/IWalletRepository";
import { Wallet } from "../../domain/entities/Wallet";
import { InternalServerError } from "../../domain/errors/index";

@injectable()
export class SubscriptionPaymentService implements ISubscriptionService {
    constructor(
        @inject(DI_TOKENS.VerifyPaymentUseCase) private verifyPayment: IVerifyPaymentUseCase,
        @inject(DI_TOKENS.UpdateUserPlanUseCase) private updateUserPlan: IUpdateUserPlan,
        @inject(DI_TOKENS.SubscriptionRepository) private subplanRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.TransactionRepository) private transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.WalletRepository) private walletRepo: IWalletRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async finalize(sessionId: string): Promise<SubscriptionFinalizeResult> {
        const verification = await this.verifyPayment.execute(sessionId);

        switch (verification.status) {
            case "completed": {
                if (verification.metadata.type === "subscription") {
                    const { userId, planLevel, billingCycle, amount } = verification.metadata;

                    this.logger.info(`Payment verified for user ${userId}`);

                    const updated = await this.updateUserPlan.execute(
                        userId,
                        planLevel as PlanLevel,
                        billingCycle as BillingCycle
                    );

                    await this.subplanRepo.updateSubscriptionStatus(
                        verification.paymentId,
                        "active"
                    );

                    await this.recordSubscriptionTransaction(
                        userId,
                        Number(amount),
                        verification.paymentId,
                        planLevel as string
                    );

                    return { status: "completed", subscription: updated };
                }

                return { status: "completed" };
            }

            case "pending":
                return { status: "pending" };

            case "failed":
            default:
                return { status: "failed", reason: "Payment verification failed" };
        }
    }

    // --- Helper to Record Revenue ---
    private async recordSubscriptionTransaction(userId: string, amount: number, paymentRefId: string, planLevel: string) {
        if (!amount || amount <= 0) return;

        let adminWallet: Wallet;
        const adminId = process.env.PLATFORM_ADMIN_ID;
        if (!adminId) {
            this.logger.error("CRITICAL: PLATFORM_ADMIN_ID is not set in .env. Revenue not recorded!");
            throw new InternalServerError("Internal Server Configuration Error");
        }
        try {
            adminWallet = await this.walletRepo.getByOwner(adminId, 'ADMIN');
        } catch {
            adminWallet = await this.walletRepo.create({
                ownerId: adminId,
                ownerType: 'ADMIN',
                balance: 0,
                currency: 'INR',
                isFrozen: false
            });
        }

        await this.transactionRepo.create({
            type: 'SUBSCRIPTION',
            fromWalletId: null,
            toWalletId: adminWallet.id,
            amount: amount,
            status: 'SUCCESS',
            paymentProvider: 'RAZORPAY',
            paymentRefId: paymentRefId,
            metadata: {
                userId,
                planLevel,
                description: `Subscription Payment: ${planLevel}`
            }
        });

        await this.walletRepo.credit(adminWallet.id, amount);

        this.logger.info(`Revenue of ${amount} recorded for Admin ${adminId}`);
    }
}
