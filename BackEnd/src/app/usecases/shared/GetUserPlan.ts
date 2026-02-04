import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetUserSubscriptionPlan } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo.js";
import { ISubscriptionRepository } from "../../repositories/interfaces/shared/ISubscriptionRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { UserSubscription } from "../../../domain/entities/Plan.js";


@injectable()
export class GetUserSubscriptionPlan implements IGetUserSubscriptionPlan {
    constructor(
        @inject(DI_TOKENS.SubscriptionRepository) private _subRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string): Promise<UserSubscription | null> {
        this._logger.info(`Fetching subscription plan for userId: ${userId}`);

        const subscription = await this._subRepo.getUserSubscription(userId);

        if (subscription) {
            this._logger.info(`Found subscription for userId: ${userId}, Level: ${subscription.level}, BillingCycle: ${subscription.billingCycle ?? "N/A"}`);
        } else {
            this._logger.info(`No subscription found for userId: ${userId}`);
        }

        return subscription;
    }
}
