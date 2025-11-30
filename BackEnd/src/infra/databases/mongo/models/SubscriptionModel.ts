import { PlanLevel, BillingCycle } from "domain/entities/Plan";
import { Document, model, Schema, Types } from "mongoose";

export interface UserSubscriptionDocument extends Document {
    userId: Types.ObjectId;
    level: PlanLevel;
    billingCycle: BillingCycle;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<UserSubscriptionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        level: { type: String, enum: ["Free", "Premium", "Super"], required: true },
        billingCycle: { type: String, enum: ["Monthly", "Yearly"], required: true },
        expiryDate: { type: Date, required: true }
    },
    { timestamps: true }
);

export const UserSubscriptionModel = model<UserSubscriptionDocument>("UserSubscription", UserSubscriptionSchema);
