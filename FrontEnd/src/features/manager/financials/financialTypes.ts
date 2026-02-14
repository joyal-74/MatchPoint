export type PayoutMethodType = 'bank' | 'upi';

export interface PayoutMethod {
    _id: string;
    type: PayoutMethodType;
    name: string;
    detail: string;
    isPrimary: boolean;
    status: 'pending' | 'verified' | 'failed';
}

export interface BasePayoutPayload {
    type: PayoutMethodType;
    name: string;
    isPrimary?: boolean;
}

export interface BankAccountPayload extends BasePayoutPayload {
    type: 'bank';
    accountNumber: string;
    ifsc: string;
}

export interface UPIPayload extends BasePayoutPayload {
    type: 'upi';
    upiId: string;
}

export type SavePayoutMethodPayload = BankAccountPayload | UPIPayload;

export interface PayoutMethodResponse extends BasePayoutPayload {
    _id: string;
    detail: string;
    status: 'verified' | 'pending';
}


// wallet

export interface IRazorpayPaymentData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount: number;
}

export interface IRazorpayOrderResponse {
    id: string;
    amount: number;
    currency: string;
    key: string;
}

export interface IVerifyPaymentResponse {
    success: boolean;
    balance: number;
}

export interface WithdrawalResponse {
    success: boolean;
    transaction: {
        _id: string;
        amount: number;
        status: 'pending' | 'success' | 'failed';
        date: string;
        description: string;
        type: 'expense'; 
    };
    newBalance: number;
}