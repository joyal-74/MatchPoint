import { Plan } from "domain/entities/Plan";

export interface IPlanRepository {
    create(plan: Plan): Promise<Plan>;
    getAll(): Promise<Plan[]>;
    delete(id: string): Promise<boolean>;
    getPlansByRole(role: string): Promise<Plan[]>;
}