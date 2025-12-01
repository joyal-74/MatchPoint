import { PlanLevel, BillingCycle } from "domain/entities/Plan";
import { Document, model, Schema, Types } from "mongoose";

export interface UserSubscriptionDocument extends Document {
    userId: Types.ObjectId;
    planId?: Types.ObjectId;
    level: PlanLevel;
    billingCycle?: BillingCycle;
    expiryDate?: Date;
    price?: number;
    transactionId?: string;
    status: "pending" | "active" | "expired";
    createdAt: Date;
    updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<UserSubscriptionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        planId: { type: Schema.Types.ObjectId, ref: "Plan" },
        level: { type: String, enum: ["Free", "Premium", "Super"], required: true },
        billingCycle: { type: String, enum: ["Monthly", "Yearly"], required: false },
        expiryDate: { type: Date },
        price: { type: Number },
        transactionId: { type: String },
        status: { type: String, enum: ["pending", "active", "expired"], default: "pending" }
    },
    { timestamps: true }
);

export const UserSubscriptionModel = model<UserSubscriptionDocument>("UserSubscription", UserSubscriptionSchema);
