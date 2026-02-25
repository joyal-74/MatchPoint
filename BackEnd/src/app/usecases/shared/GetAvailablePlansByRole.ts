import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ILogger } from "../../providers/ILogger";
import { Plan } from "../../../domain/entities/Plan";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository";


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
