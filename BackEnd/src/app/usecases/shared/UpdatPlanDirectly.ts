import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IUpdateUserDirectlyPlan } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo";
import { ISubscriptionRepository } from "../../repositories/interfaces/shared/ISubscriptionRepository";
import { ILogger } from "../../providers/ILogger";
import { BillingCycle, PlanLevel } from "../../../domain/entities/Plan";
import { ForbiddenError } from "../../../domain/errors/index";


const getPlanRank = (level: string): number => {
    const ranks: Record<string, number> = { "Free": 0, "Basic": 1, "Super": 2, "Premium": 3 };
    return ranks[level] || 0;
};

@injectable()
export class UpdateUserDirectlyPlan implements IUpdateUserDirectlyPlan {
    constructor(
        @inject(DI_TOKENS.SubscriptionRepository) private _subRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) {
        const currentSub = await this._subRepo.getUserSubscription(userId);

        if (currentSub) {
            const currentRank = getPlanRank(currentSub.level);
            const targetRank = getPlanRank(level);

            if (targetRank > currentRank) {
                this._logger.warn(`User ${userId} attempted direct upgrade to ${level} without payment.`);
                throw new ForbiddenError("Upgrades require payment. Please use the checkout flow.");
            }
        }

        this._logger.info(`Processing direct plan update (Downgrade/Schedule) for userId: ${userId} to ${level}`);

        const result = await this._subRepo.updateUserPlan(userId, level, billingCycle);

        return result;
    }
}
