import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { Plan } from "domain/entities/Plan";
import { PlanModel } from "infra/databases/mongo/models/PlanModel";

export class PlanRepository implements IPlanRepository {
    async create(plan: Plan): Promise<Plan> {
        return await PlanModel.create(plan);
    }

    async getAll(): Promise<Plan[]> {
        return await PlanModel.find().sort({ createdAt: -1 });
    }

    async delete(id: string): Promise<boolean> {
        const res = await PlanModel.findByIdAndDelete(id);
        return !!res;
    }

    async getPlansByRole(role: Plan["userType"]): Promise<Plan[]> {
        return await PlanModel.find({ userType: role }).sort({ createdAt: -1 });
    }
}