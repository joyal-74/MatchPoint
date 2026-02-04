import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";
import { IUpdatePlan } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ILogger } from "../../providers/ILogger.js";
import { Plan } from "../../../domain/entities/Plan.js";


@injectable()
export class UpdatePlanUseCase implements IUpdatePlan {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private _planRepo: IPlanRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(id: string, planData: Plan): Promise<Plan> {
        this._logger.info(`UpdatePlanUseCase => Attempting to update plan with ID: ${id}`);

        this._logger.info(`UpdatePlanUseCase => Update Payload: ${planData}`);

        const updatedPlan = await this._planRepo.update(id, planData);

        this._logger.info(`UpdatePlanUseCase => Successfully updated plan ID: ${id}`);

        return updatedPlan;
    }
}
