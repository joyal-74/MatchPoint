import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger"; // Assuming you have this
import { ICreatePlan } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";
import { BadRequestError } from "domain/errors";

@injectable()
export class CreatePlanUseCase implements ICreatePlan {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private _planRepo: IPlanRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(planData: Plan): Promise<Plan> {
        this._logger.info("CreatePlanUseCase => Checking for existing plan...");

        const existingPlan = await this._planRepo.findByTypeAndLevel(
            planData.userType, 
            planData.level, 
            planData.billingCycle
        );

        if (existingPlan) {
            this._logger.warn(`CreatePlanUseCase => Duplicate plan attempt: ${planData.level} for ${planData.userType}`);
            
            throw new BadRequestError(
                `A ${planData.level} plan for ${planData.userType}s already exists. Please edit the existing plan instead.`
            );
        }

        this._logger.info("CreatePlanUseCase => Creating new plan...");
        return await this._planRepo.create(planData);
    }
}