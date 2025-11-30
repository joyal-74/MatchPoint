import { IDeletePlan } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";

export class DeletePlanUseCase implements IDeletePlan {
    constructor(private planRepo: IPlanRepository) {}

    async execute(id: string): Promise<boolean> {
        return await this.planRepo.delete(id);
    }
}
