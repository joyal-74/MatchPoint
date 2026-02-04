import { BillingCycle, PlanLevel, UserSubscription } from "../../../domain/entities/Plan.js";
import { UserSubscriptionDocument } from "../../../infra/databases/mongo/models/SubscriptionModel.js";

export class SubscriptionMapper {
    static toDomain(doc: UserSubscriptionDocument): UserSubscription {
        return {
            userId: doc.userId.toString(),
            level: doc.level as PlanLevel,
            billingCycle: doc.billingCycle as BillingCycle,
            expiryDate: doc.expiryDate ?? new Date(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,

            status: doc.status as "pending" | "active" | "expired"
        };
    }

    static toPersistence(entity: UserSubscription): Partial<UserSubscriptionDocument> {
        return {
            userId: entity.userId as any,
            level: entity.level,
            billingCycle: entity.billingCycle,
            expiryDate: entity.expiryDate,
            status: entity.status
        };
    }
}
