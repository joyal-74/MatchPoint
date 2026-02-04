import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ILogger } from "../../providers/ILogger.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";


@injectable()
export class GetAvailablePlansByRole {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private _planRepo: IPlanRepository,
        private logger: ILogger
    ) { }

    async execute(role: string): Promise<Plan[]> {
        this.logger.info(`Fetching plans for role: ${role}`);
        return await this._planRepo.getPlansByRole(role);
    }
}
