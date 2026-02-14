import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";
import { IGetPlans } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ILogger } from "../../providers/ILogger.js";


@injectable()
export class GetPlansUseCase implements IGetPlans {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private planRepo: IPlanRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(): Promise<Plan[]> {
        this._logger.info("GetPlansUseCase => Fetching all active plans for administration");

        const startTime = Date.now();
        const plans = await this.planRepo.getAll();
        const duration = Date.now() - startTime;

        this._logger.info(
            `GetPlansUseCase => Successfully retrieved ${plans.length} plans in ${duration}ms`
        );

        if (plans.length === 0) {
            this._logger.warn("GetPlansUseCase => No plans found in the database");
        } 

        return plans;
    }
}