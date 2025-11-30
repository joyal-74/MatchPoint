export type PlanLevel = 'Free' | 'Premium' | 'Super';
export type BillingCycle = 'Monthly' | 'Yearly';

export interface AvailablePlan {
    _id : string;
    level: PlanLevel;
    title: string;
    description: string;
    price: number;
    billingCycle: BillingCycle;
    features: string[];
    isPopular?: boolean;
}

export interface UserSubscription {
    planId: string;
    level: PlanLevel;
    price: number;
    billingCycle: BillingCycle;
    expiryDate: string;
    status: 'Active' | 'Pending Cancellation';
}