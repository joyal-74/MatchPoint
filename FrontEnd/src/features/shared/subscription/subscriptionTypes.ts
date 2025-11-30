export interface AvailablePlan {
  _id: string;
  level: "Free" | "Premium" | "Super";
  title: string;
  description: string;
  price: number;
  billingCycle: "Monthly" | "Yearly";
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  planId: string;
  level: string;
  price: number;
  billingCycle: string;
  expiryDate: string;
  status: string;
}