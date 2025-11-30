import { UserSubscription } from "domain/entities/Plan";
import { UserSubscriptionDocument } from "infra/databases/mongo/models/SubscriptionModel";

export class SubscriptionMapper {
    static toDomain(doc: UserSubscriptionDocument): UserSubscription {
        return {
            userId: (doc.userId).toString(),
            level: doc.level,
            billingCycle : doc.billingCycle,
            expiryDate: doc.expiryDate,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}