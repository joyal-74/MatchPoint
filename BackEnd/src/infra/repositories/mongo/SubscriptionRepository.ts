import { UpdateQuery } from "mongoose";
import { BillingCycle, PlanLevel, UserSubscription } from "../../../domain/entities/Plan.js";
import { ISubscriptionRepository } from "../../../app/repositories/interfaces/shared/ISubscriptionRepository.js";
import { UserSubscriptionDocument, UserSubscriptionModel } from "../../databases/mongo/models/SubscriptionModel.js";
import { SubscriptionMapper } from "../../utils/mappers/SubscriptionMapper.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";

const getPlanRank = (level: PlanLevel): number => {
    const ranks: Record<PlanLevel, number> = { "Free": 0, "Super": 1, "Premium": 2 };
    return ranks[level] || 0;
};

export class SubscriptionRepository implements ISubscriptionRepository {

    async create(subscriptionData: Partial<UserSubscription>): Promise<UserSubscription> {
        const doc = await UserSubscriptionModel.create(subscriptionData);
        return SubscriptionMapper.toDomain(doc); 
    }

    async updateUserPlan(userId: string, level: PlanLevel, billingCycle?: BillingCycle): Promise<UserSubscription> {

        const currentSub = await UserSubscriptionModel.findOne({ userId });
        const now = new Date();

        const updates: Partial<UserSubscriptionDocument> = {};
        
        const removals: Record<string, 1> = {};

        const hasActivePlan = 
            currentSub && 
            currentSub.level !== "Free" && 
            currentSub.expiryDate && 
            currentSub.expiryDate > now;

        // --- SCENARIO A: NEW SUBSCRIPTION ---
        if (!hasActivePlan) {
            if (level === "Free") {
                updates.level = "Free";
                updates.status = "active";
                
                // Mark fields for removal
                removals.expiryDate = 1;
                removals.billingCycle = 1;
                removals.reservedPlan = 1;
                removals.scheduledChange = 1;
            } else {
                if (!billingCycle) throw new BadRequestError("Billing cycle required");
                
                updates.level = level;
                updates.billingCycle = billingCycle;
                updates.expiryDate = this.calculateExpiry(now, billingCycle);
                updates.status = "active";
                updates.updatedAt = now;
            }
        } 
        
        // --- SCENARIO B: MODIFYING ACTIVE PLAN ---
        else {
            if (level === "Free") {
                 updates.scheduledChange = {
                    level: "Free",
                    billingCycle: "Monthly",
                    status: "pending_downgrade"
                 };
            } else {
                if (!billingCycle) throw new BadRequestError("Billing cycle required");

                const currentRank = getPlanRank(currentSub.level as PlanLevel);
                const newRank = getPlanRank(level);

                // UPGRADE
                if (newRank > currentRank) {
                    const msRemaining = currentSub.expiryDate!.getTime() - now.getTime();
                    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
                    
                    if (daysRemaining > 0) {
                        updates.reservedPlan = {
                            level: currentSub.level,
                            daysRemaining: daysRemaining
                        };
                    }

                    updates.level = level;
                    updates.billingCycle = billingCycle;
                    updates.expiryDate = this.calculateExpiry(now, billingCycle);
                    
                    // Remove any pending downgrades
                    removals.scheduledChange = 1; 
                }

                // DOWNGRADE (Queue it)
                else if (newRank < currentRank) {
                    updates.scheduledChange = {
                        level: level,
                        billingCycle: billingCycle,
                        status: "pending_downgrade"
                    };
                }

                // RENEWAL
                else {
                    const startDate = new Date(currentSub.expiryDate!);
                    updates.expiryDate = this.calculateExpiry(startDate, billingCycle);
                    updates.billingCycle = billingCycle; 
                }
            }
        }

        // 2. Construct the Mongoose Query
        const updateQuery: UpdateQuery<UserSubscriptionDocument> = { 
            $set: updates, 
            $unset: removals 
        };

        const doc = await UserSubscriptionModel.findOneAndUpdate(
            { userId },
            updateQuery,
            { upsert: true, new: true }
        );

        if (!doc) throw new NotFoundError("Update failed");

        return SubscriptionMapper.toDomain(doc);
    }

    private calculateExpiry(startDate: Date, cycle: BillingCycle): Date {
        const date = new Date(startDate);
        if (cycle === "Monthly") {
            date.setMonth(date.getMonth() + 1);
        } else {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date;
    }

    async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOne({ userId });
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }

    async findByTransactionId(transactionId: string): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOne({ transactionId });
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }

    async updateSubscriptionStatus(transactionId: string, status: "active" | "pending" | "expired"): Promise<UserSubscription | null> {
        const doc = await UserSubscriptionModel.findOneAndUpdate(
            { transactionId },
            { status },
            { new: true }
        );
        return doc ? SubscriptionMapper.toDomain(doc) : null;
    }
}
