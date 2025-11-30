import { IGetPlans } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";

export class GetPlansUseCase implements IGetPlans {
    constructor(private planRepo: IPlanRepository) {}

    async execute() : Promise<Plan[]> {
        return await this.planRepo.getAll();
    }
}