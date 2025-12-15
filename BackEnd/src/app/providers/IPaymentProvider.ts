import { PaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";

export interface PaymentSession {
    sessionId: string;
    url: string;
    keyId?: string;
    orderId?: string;
    transactionId?: string;
}

export interface IPaymentProvider {

    createPaymentSession(amount: number, currency: string, title: string, metadata: PaymentMetadata): Promise<PaymentSession>;
    verifyPayment(sessionId: string): Promise<{ status: "pending" | "completed" | "failed"; paymentId: string; metadata: PaymentMetadata; }>;
}
