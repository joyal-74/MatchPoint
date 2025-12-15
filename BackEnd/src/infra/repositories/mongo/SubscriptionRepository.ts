import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { UserSubscriptionModel } from "infra/databases/mongo/models/SubscriptionModel";
import { BillingCycle, PlanLevel, UserSubscription } from "domain/entities/Plan";
import { SubscriptionMapper } from "infra/utils/mappers/SubscriptionMapper";
import { BadRequestError, NotFoundError } from "domain/errors";

export class SubscriptionRepository implements ISubscriptionRepository {

    async updateUserPlan(userId: string, level: PlanLevel, billingCycle?: BillingCycle): Promise<UserSubscription> {

        let expiryDate: Date | undefined;

        if (level !== "Free") {
            if (!billingCycle) throw new BadRequestError("Billing cycle required");
            const now = new Date();
            expiryDate = new Date(now);

            if (billingCycle === "Monthly") {
                expiryDate.setMonth(now.getMonth() + 1);
            } else {
                expiryDate.setFullYear(now.getFullYear() + 1);
            }
        }

        const updateData: Partial<UserSubscription> = {
            level,
            ...(billingCycle ? { billingCycle } : {}),
            ...(expiryDate ? { expiryDate } : {})
        };

        const doc = await UserSubscriptionModel.findOneAndUpdate(
            { userId },
            updateData,
            { upsert: true, new: true }
        );

        if (!doc) throw new NotFoundError("Update failed");

        return SubscriptionMapper.toDomain(doc);
    }

    async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOne({ userId });
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }

    async findByTransactionId(transactionId: string): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOne({ transactionId });
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }

    async updateSubscriptionStatus(
        transactionId: string,
        status: "active" | "pending" | "expired"
    ): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOneAndUpdate(
            { transactionId },
            { status },
            { new: true }
        );
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }
}