import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUpdateUserPlan } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo.js";
import { ILogger } from "../../providers/ILogger.js";
import { ISubscriptionRepository } from "../../repositories/interfaces/shared/ISubscriptionRepository.js";
import { BillingCycle, PlanLevel } from "../../../domain/entities/Plan.js";
import { BadRequestError } from "../../../domain/errors/index.js";


@injectable()
export class UpdateUserPlan implements IUpdateUserPlan {
    constructor(
        @inject(DI_TOKENS.SubscriptionRepository) private _subRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) {
        this._logger.info(`Validating plan update for userId: ${userId}`);

        const currentSub = await this._subRepo.getUserSubscription(userId);
        
        if (!currentSub) {
            this._logger.warn(`Update failed: No active subscription found for userId: ${userId}`);
            throw new BadRequestError("No active subscription found for this user.");
        }

        const isSameLevel = currentSub.level === level;
        const isSameCycle = billingCycle ? currentSub.billingCycle === billingCycle : true;

        if (isSameLevel && isSameCycle) {
            this._logger.info(`Update skipped: Plan for userId: ${userId} is already at the requested state.`);
            return currentSub;
        }

        if (level !== 'Free' && !billingCycle && !currentSub.billingCycle) {
            throw new BadRequestError("Billing cycle is required for paid plans.");
        }

        // 4. Perform the update
        this._logger.info(`Updating subscription for userId: ${userId} to level: ${level}`);
        const result = await this._subRepo.updateUserPlan(userId, level, billingCycle);

        this._logger.info(`Successfully updated subscription for userId: ${userId}`);
        return result;
    }
}