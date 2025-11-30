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


export interface InitiateOrderPayload {
    userId: string;
    level: string;
    billingCycle: string;
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