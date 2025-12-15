import { ILogger } from "app/providers/ILogger";
import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { IUpdateUserPlan, IVerifyPaymentUseCase } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { ISubscriptionService, SubscriptionFinalizeResult } from "app/services/ISubscriptionServices";
import { BillingCycle, PlanLevel } from "domain/entities/Plan";

export class SubscriptionPaymentService implements ISubscriptionService {
    constructor(
        private verifyPayment: IVerifyPaymentUseCase,
        private updateUserPlan: IUpdateUserPlan,
        private repo: ISubscriptionRepository,
        private logger: ILogger
    ) {}

    async finalize(sessionId: string): Promise<SubscriptionFinalizeResult> {
        const verification = await this.verifyPayment.execute(sessionId);

        switch (verification.status) {
            case "completed": {
                if (verification.metadata.type === "subscription") {
                    const { userId, planLevel, billingCycle } = verification.metadata;

                    this.logger.info(`Payment verified for user ${userId}`);

                    const updated = await this.updateUserPlan.execute(
                        userId,
                        planLevel as PlanLevel,
                        billingCycle as BillingCycle
                    );

                    await this.repo.updateSubscriptionStatus(
                        verification.paymentId,
                        "active"
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
}