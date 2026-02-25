import { PlanLevel, BillingCycle } from "../../../../domain/entities/Plan";
import { Document, model, Schema, Types } from "mongoose";

interface ReservedPlan {
    level: PlanLevel;
    daysRemaining: number;
}

interface ScheduledChange {
    level: PlanLevel;
    billingCycle: BillingCycle;
    status: "pending_downgrade" | "pending_upgrade";
}

export interface UserSubscriptionDocument extends Document {
    userId: Types.ObjectId;
    planId?: Types.ObjectId;
    level: PlanLevel;
    billingCycle?: BillingCycle;
    expiryDate?: Date;
    price?: number;
    transactionId?: string;
    status: "pending" | "active" | "expired";
    
    reservedPlan?: ReservedPlan; 
    scheduledChange?: ScheduledChange;
    
    createdAt: Date;
    updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<UserSubscriptionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        planId: { type: Schema.Types.ObjectId, ref: "Plan" },
        level: { type: String, enum: ["Free", "Premium", "Super"], required: true },
        billingCycle: { type: String, enum: ["Monthly", "Yearly"] },
        expiryDate: { type: Date },
        price: { type: Number },
        transactionId: { type: String },
        status: { type: String, enum: ["pending", "active", "expired"], default: "pending" },

        reservedPlan: {
            level: { type: String, enum: ["Free", "Premium", "Super"] },
            daysRemaining: { type: Number }
        },

        scheduledChange: {
            level: { type: String, enum: ["Free", "Premium", "Super"] },
            billingCycle: { type: String, enum: ["Monthly", "Yearly"] },
            status: { type: String, enum: ["pending_downgrade", "pending_upgrade"] }
        }
    },
    { timestamps: true }
);

export const UserSubscriptionModel = model<UserSubscriptionDocument>("UserSubscription", UserSubscriptionSchema);
