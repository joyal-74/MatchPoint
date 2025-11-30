import { BillingCycle, PlanLevel, UserSubscription } from "domain/entities/Plan";

export interface ISubscriptionRepository {
    updateUserPlan(userId: string, level: PlanLevel, billingCycle?: BillingCycle): Promise<UserSubscription>;

    getUserSubscription(userId: string): Promise<UserSubscription | null>;
}