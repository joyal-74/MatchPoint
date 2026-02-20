import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";
import { IUpdatePlan } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ILogger } from "../../providers/ILogger.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";
import { validatePlanData } from "../../../domain/validators/validatePlanData.js";


@injectable()
export class UpdatePlanUseCase implements IUpdatePlan {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private _planRepo: IPlanRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

async execute(id: string, planData: Partial<Plan>): Promise<Plan> {
        this._logger.info(`UpdatePlanUseCase => Attempting to update plan: ${id}`);

        const existingPlan = await this._planRepo.findById(id);
        if (!existingPlan) {
            this._logger.error(`UpdatePlanUseCase => Plan not found: ${id}`);
            throw new NotFoundError("Plan not found");
        }

        validatePlanData(planData);

        if (planData.level === "Free" && (planData.price && planData.price > 0)) {
            throw new BadRequestError("A 'Free' plan cannot have a price greater than 0");
        }

        const updatedPlan = await this._planRepo.update(id, planData);

        this._logger.info(`UpdatePlanUseCase => Successfully updated plan ID: ${id}`);
        return updatedPlan;
    }
}