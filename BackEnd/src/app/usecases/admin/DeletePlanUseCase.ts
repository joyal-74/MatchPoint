import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IDeletePlan } from "../../repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "../../repositories/interfaces/admin/IPlanRepository";


@injectable()
export class DeletePlanUseCase implements IDeletePlan {
    constructor(
        @inject(DI_TOKENS.PlanRepository) private planRepo: IPlanRepository
    ) {}

    async execute(id: string): Promise<boolean> {
        return await this.planRepo.delete(id);
    }
}
