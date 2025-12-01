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