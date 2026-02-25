import { Schema, model } from "mongoose";
import { Plan } from "../../../../domain/entities/Plan";

const PlanSchema = new Schema<Plan>(
    {
        title: { type: String, required: true },
        userType: { type: String, enum: ["player", "manager", "viewer"], required: true },
        level: { type: String, enum: ["Free", "Premium", "Super"], required: true },
        billingCycle: { type: String, enum: ["Monthly", "Yearly"], required: false },
        price: { type: Number, required: true },
        isArchived: { type: Boolean, default: false },
        features: [{ type: String, required: true }]
    },
    { timestamps: true }
);

export const PlanModel = model<Plan>("Plan", PlanSchema);
