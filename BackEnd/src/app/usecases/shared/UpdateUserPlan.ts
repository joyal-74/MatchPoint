import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { IUpdateUserPlan } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { BillingCycle, PlanLevel } from "domain/entities/Plan";

@injectable()
export class UpdateUserPlan implements IUpdateUserPlan{
    constructor(
        @inject(DI_TOKENS.SubscriptionRepository) private _subRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) {
        this._logger.info(`Updating subscription for userId: ${userId}, level: ${level}, billingCycle: ${billingCycle ?? "N/A"}`);
        
        const result = await this._subRepo.updateUserPlan(userId, level, billingCycle);

        this._logger.info(`Successfully updated subscription for userId: ${userId}`);
        return result;
    }
}