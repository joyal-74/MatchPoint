export interface PayoutRequest {
    fundAccountId: string;
    amount: number;
    referenceId: string;
    type: 'bank' | 'upi',
}

export type PayoutMethodType = 'vpa' | 'bank_account';

export interface RegisterFundAccountRequest {
    userId: string;
    type: PayoutMethodType;
    details: {
        name?: string;
        address?: string;
        ifsc?: string;
        accountNumber?: string;
    };
}

export interface IPayoutProvider {
    sendMoney(data: PayoutRequest): Promise<{ payoutId: string; status: string }>;
    registerFundAccount(data: RegisterFundAccountRequest);
}
