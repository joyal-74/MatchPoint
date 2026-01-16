export type PlanLevel = "Free" | "Basic" | "Super" | "Premium";

export interface ScheduledChange {
    level: PlanLevel;
    billingCycle: "Monthly" | "Yearly";
    status: "pending_downgrade" | "pending_upgrade";
}

export interface UserSubscription {
    _id: string;
    userId: string;
    level: PlanLevel;
    billingCycle: "Monthly" | "Yearly";
    expiryDate: string; 
    status: "active" | "pending" | "expired";
    
    reservedPlan?: {
        level: PlanLevel;
        daysRemaining: number;
    };
    scheduledChange?: ScheduledChange;
}

export interface AvailablePlan {
    _id: string;
    title: string;
    description: string;
    price: number;
    level: PlanLevel;
    features: string[];
    billingCycle: "Monthly" | "Yearly";
}