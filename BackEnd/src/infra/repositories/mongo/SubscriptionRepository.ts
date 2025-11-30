import { ISubscriptionRepository } from "app/repositories/interfaces/shared/ISubscriptionRepository";
import { UserSubscriptionModel } from "infra/databases/mongo/models/SubscriptionModel";
import { BillingCycle, PlanLevel, UserSubscription } from "domain/entities/Plan";
import { SubscriptionMapper } from "infra/utils/mappers/SubscriptionMapper";
import { BadRequestError, NotFoundError } from "domain/errors";

export class SubscriptionRepository implements ISubscriptionRepository {

    async updateUserPlan(userId: string, level: PlanLevel, billingCycle?: BillingCycle): Promise<UserSubscription> {
        let expiryDate: Date | undefined;

        if (level !== "Free") {
            if (!billingCycle) throw new BadRequestError("Billing cycle is required for paid plans");
            const expiryDays = billingCycle === "Monthly" ? 30 : 365;
            expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
        }

        const updateData: Partial<UserSubscription> = { level };
        if (expiryDate) updateData.expiryDate = expiryDate;
        if (billingCycle) updateData.billingCycle = billingCycle;

        const doc = await UserSubscriptionModel.findOneAndUpdate(
            { userId },
            updateData,
            { upsert: true, new: true }
        );

        if (!doc) throw new NotFoundError("Failed to update subscription");

        return SubscriptionMapper.toDomain(doc);
    }



    async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOne({ userId });

        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }
}