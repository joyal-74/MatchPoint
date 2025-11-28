export type UserRole = 'Player' | 'Manager' | 'Viewer';
export type PlanLevel = 'Free' | 'Premium' | 'Super';

export interface Plan {
    id: string;
    userType: UserRole;
    level: PlanLevel;
    title: string;
    price: number;
    features: string[];
}

export interface PlanForm {
    userType: UserRole;
    level: PlanLevel;
    title: string;
    price: string;
    featuresInput: string;
}