import { Plan } from "domain/entities/Plan";

export interface IPlanRepository {
    create(plan: Plan): Promise<Plan>;
    findByTypeAndLevel(userType: string, level: string, billingCycle?: string): Promise<Plan | null>;
    getAll(): Promise<Plan[]>;
    delete(id: string): Promise<boolean>;
    update(id: string, newPlan : Plan): Promise<Plan>;
    getPlansByRole(role: string): Promise<Plan[]>;
}