import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IDeletePlan } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository.js";


@injectable()
export class DeletePlanUseCase implements IDeletePlan {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private planRepo: IPlanRepository
    ) {}

    async execute(id: string): Promise<boolean> {
        return await this.planRepo.delete(id);
    }
}
