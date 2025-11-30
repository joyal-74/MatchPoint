export type UserRole = 'player' | 'manager' | 'viewer';
export type PlanLevel = 'Free' | 'Premium' | 'Super';
export type BillingCycle = 'Monthly' | 'Yearly';

export interface Plan {
    _id: string;
    userType: UserRole;
    level: PlanLevel;
    title: string;
    billingCycle?: BillingCycle;
    price: number;
    features: string[];
}

export interface PlanForm {
    userType: UserRole;
    level: PlanLevel;
    title: string;
    price: string;
    featuresInput: string;
    billingCycle: BillingCycle | undefined;
}