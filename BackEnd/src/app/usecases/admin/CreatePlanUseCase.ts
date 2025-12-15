import { ICreatePlan } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";


export class CreatePlanUseCase implements ICreatePlan {
    constructor(
        private _planRepo: IPlanRepository
    ) {}

    async execute(planData: Plan): Promise<Plan> {
        console.log(planData)
        return await this._planRepo.create(planData);
    }
}