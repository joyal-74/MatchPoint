import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ICreatePlan } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { BadRequestError } from "../../../domain/errors/index.js";


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
