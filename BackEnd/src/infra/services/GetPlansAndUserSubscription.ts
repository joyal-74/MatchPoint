import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { IGetPlansAndUserSubscription } from "../../app/services/ISubscriptionServices.js";
import { IPlanRepository } from "../../app/repositories/interfaces/admin/IPlanRepository.js";
import { ISubscriptionRepository } from "../../app/repositories/interfaces/shared/ISubscriptionRepository.js";
import { ILogger } from "../../app/providers/ILogger.js";


@injectable()
export class GetPlansAndUserSubscription implements IGetPlansAndUserSubscription {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private _planRepo: IPlanRepository,
        @inject(DI_TOKENS.SubscriptionRepository) private _subscriptionRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
