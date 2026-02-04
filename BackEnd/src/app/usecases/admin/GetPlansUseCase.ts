import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";
import { IGetPlans } from "../../repositories/interfaces/admin/IAdminUsecases.js";


@injectable()
export class GetPlansUseCase implements IGetPlans {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private planRepo: IPlanRepository
    ) {}

    async execute() : Promise<Plan[]> {
        return await this.planRepo.getAll();
    }
}
