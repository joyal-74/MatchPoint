import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IGetPlans } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";

@injectable()
export class GetPlansUseCase implements IGetPlans {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private planRepo: IPlanRepository
    ) {}

    async execute() : Promise<Plan[]> {
        return await this.planRepo.getAll();
    }
}