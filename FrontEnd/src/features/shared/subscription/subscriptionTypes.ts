import type { BillingCycle } from "../../../pages/admin/shared/subscription/SubscriptionTypes";

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


export interface InitiateOrderPayload {
  amount: number;
  currency: string;
  title: string;
  metadata: {
    type: "subscription",
    userId: string,
    planLevel: PlanLevel,
    billingCycle: BillingCycle
  };
}

export interface InitiateOrderResponse {
  keyId: string;
  orderId: string;
  transactionId: string;
  amount: number;
}

export interface FinalizePaymentPayload {
  userId: string;
  transactionId: string;
  paymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface FinalizePaymentResponse {
  status: "completed" | "pending";
  subscriptionId: string;
  message: string;
}