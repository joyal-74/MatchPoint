export interface PaymentMetadata {
    tournamentId: string;
    teamId: string;
    captainId: string;
    managerId: string;
}

export interface PaymentSession {
    sessionId: string;
    url: string;
    keyId?: string;
    orderId?: string;
}

export interface IPaymentProvider {
    createPaymentSession(
        amount: number,
        currency: string,
        teamName: string,
        metadata: PaymentMetadata
    ): Promise<PaymentSession>;

    verifyPayment(sessionId: string): Promise<{ status: 'pending' |'completed' | 'failed'; paymentId: string; metadata: PaymentMetadata }>;
}
