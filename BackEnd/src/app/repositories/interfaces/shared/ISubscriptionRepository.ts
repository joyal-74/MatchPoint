import { BillingCycle, PlanLevel, UserSubscription } from "../../../../domain/entities/Plan";

export interface ISubscriptionRepository {
    create(subscriptionData: Partial<UserSubscription>): Promise<UserSubscription>;
    getUserSubscription(userId: string): Promise<UserSubscription | null>;
    updateUserPlan(userId: string, level: PlanLevel, billingCycle?: BillingCycle): Promise<UserSubscription>; 
    updateSubscriptionStatus(transactionId: string, status: "active" | "pending" | "expired"): Promise<UserSubscription | null>;
    findByTransactionId(transactionId: string): Promise<UserSubscription | null>;
}
