export type UserRole = 'player' | 'manager' | 'viewer';
export type PlanLevel = 'Free' | 'Premium' | 'Super';

export interface Plan {
    _id: string;
    userType: UserRole;
    level: PlanLevel;
    title: string;
    price: number;
    features: string[];
}
