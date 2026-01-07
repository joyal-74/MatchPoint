import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IUpdatePlan } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";

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