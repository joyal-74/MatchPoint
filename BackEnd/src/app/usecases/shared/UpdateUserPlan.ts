import { ILogger } from "app/providers/ILogger";
import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { IUpdateUserPlan } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { BillingCycle, PlanLevel } from "domain/entities/Plan";

export class UpdateUserPlan implements IUpdateUserPlan{
    constructor(
        private repo: ISubscriptionRepository,
        private logger: ILogger
    ) { }

    async execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) {
        this.logger.info(`Updating subscription for userId: ${userId}, level: ${level}, billingCycle: ${billingCycle ?? "N/A"}`);
        
        const result = await this.repo.updateUserPlan(userId, level, billingCycle);

        this.logger.info(`Successfully updated subscription for userId: ${userId}`);
        return result;
    }
}