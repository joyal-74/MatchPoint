import { IPlanRepository } from "../../../app/repositories/interfaces/admin/IPlanRepository.js";
import { Plan } from "../../../domain/entities/Plan.js";
import { PlanModel } from "../../databases/mongo/models/PlanModel.js";


export class PlanRepository implements IPlanRepository {
    async create(plan: Plan): Promise<Plan> {
        return await PlanModel.create(plan);
    }

    async getAll(): Promise<Plan[]> {
        return await PlanModel.find().sort({ createdAt: -1 });
    }

    async findByTypeAndLevel(userType: string, level: string, billingCycle?: string): Promise<Plan | null> {
        const query = {
            userType,
            level,
            ...(billingCycle && { billingCycle })
        };

        if (billingCycle) {
            query.billingCycle = billingCycle;
        }

        return await PlanModel.findOne(query).exec();
    }

    async delete(id: string): Promise<boolean> {
        const res = await PlanModel.findByIdAndDelete(id);
        return !!res;
    }

    async getPlansByRole(role: Plan["userType"]): Promise<Plan[]> {
        return await PlanModel.find({ userType: role }).sort({ createdAt: -1 });
    }

    async update(id: string, newPlan: Plan): Promise<Plan> {
        const { _id, ...updateData } = newPlan as Plan;
        console.log(_id)

        const result = await PlanModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!result) {
            throw new Error("Plan not found");
        }

        return result;
    }
}
