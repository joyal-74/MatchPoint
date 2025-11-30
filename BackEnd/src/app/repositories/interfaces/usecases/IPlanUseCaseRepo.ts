import { BillingCycle, Plan, PlanLevel, UserSubscription } from "domain/entities/Plan";

export interface IGetUserSubscriptionPlan {
    execute(userId: string): Promise<UserSubscription | null>
}

export interface IUpdateUserPlan {
    execute(userId: string, level: PlanLevel, billingCycle?: BillingCycle) : Promise<UserSubscription>;
}

export interface IGetAvailablePlansByRole {
    execute(role: string): Promise<Plan[]>
}