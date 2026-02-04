export type PlanLevel = "Free" | "Premium" | "Super";
export type BillingCycle = "Monthly" | "Yearly";

export interface Plan {
    _id?: string;
    title: string;
    userType: "Player" | "Manager" | "Viewer";
    level: PlanLevel;
    price: number;
    billingCycle?: BillingCycle;
    features: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserSubscription {
    userId: string;
    level: "Free" | "Premium" | "Super";
    billingCycle: BillingCycle;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
    status: "pending" | "active" | "expired";
}
