export type PayoutMethodType = 'bank' | 'upi';

export interface BankAccountPayload {
    type: 'bank';
    name: string;
    accountNumber: string;
    ifsc: string;
}

export interface UPIPayload {
    type: 'upi';
    name: string;
    upiId: string;
}

export type SavePayoutMethodPayload = BankAccountPayload | UPIPayload;


export interface IRazorpayPaymentData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount?: number;
}
