import { ILogger } from "app/providers/ILogger";
import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { IGetUserSubscriptionPlan } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { UserSubscription } from "domain/entities/Plan";


export class GetUserSubscriptionPlan implements IGetUserSubscriptionPlan {
    constructor(
        private repo: ISubscriptionRepository,
        private logger: ILogger
    ) { }

    async execute(userId: string): Promise<UserSubscription | null> {
        this.logger.info(`Fetching subscription plan for userId: ${userId}`);

        const subscription = await this.repo.getUserSubscription(userId);

        if (subscription) {
            this.logger.info(`Found subscription for userId: ${userId}, Level: ${subscription.level}, BillingCycle: ${subscription.billingCycle ?? "N/A"}`);
        } else {
            this.logger.info(`No subscription found for userId: ${userId}`);
        }

        return subscription;
    }
}