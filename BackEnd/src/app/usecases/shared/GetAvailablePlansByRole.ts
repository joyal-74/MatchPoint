import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { ILogger } from "app/providers/ILogger";
import { Plan } from "domain/entities/Plan";

export class GetAvailablePlansByRole {
    constructor(
        private repo: IPlanRepository,
        private logger: ILogger
    ) { }

    async execute(role: string): Promise<Plan[]> {
        this.logger.info(`Fetching plans for role: ${role}`);
        return await this.repo.getPlansByRole(role);
    }
}
