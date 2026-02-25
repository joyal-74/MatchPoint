import { Plan } from "../../../../domain/entities/Plan";

export interface IPlanRepository {
    create(plan: Plan): Promise<Plan>;
    findById(id : string): Promise<Plan | null>;
    findByTypeAndLevel(userType: string, level: string, billingCycle?: string): Promise<Plan | null>;
    getAll(): Promise<Plan[]>;
    delete(id: string): Promise<boolean>;
    update(id: string, newPlan: Partial<Plan>): Promise<Plan>;
    getPlansByRole(role: string): Promise<Plan[]>;
}
