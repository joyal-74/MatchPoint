import { ILogger } from "app/providers/ILogger";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { IGetPlansAndUserSubscription } from "app/services/SubscriptionServices";


export class GetPlansAndUserSubscription implements IGetPlansAndUserSubscription {
    constructor(
        private _planRepo: IPlanRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _logger: ILogger
    ) {}

    async execute({ role, userId }) {
        this._logger.info(`Fetching plans and subscription for role=${role}, userId=${userId}`);

        const plans = await this._planRepo.getPlansByRole(role);
        const userSubscription = await this._subscriptionRepo.getUserSubscription(userId);

        return {
            plans,
            userSubscription
        };
    }
}