export interface ChargeEntryFeeDTO {
    playerUserId: string;
    tournamentId: string;
    amount: number;
    description: string;
}



export type TransactionType =
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'ENTRY_FEE'
    | 'PRIZE'
    | 'COMMISSION'
    | 'REFUND'
    | 'SUBSCRIPTION';

export type TransactionStatus =
    | 'PENDING'
    | 'SUCCESS'
    | 'FAILED';

export type PaymentProvider =
    | 'INTERNAL'
    | 'RAZORPAY'
    | 'STRIPE';

export interface TransactionCreateDTO {
    type: TransactionType;

    fromWalletId?: string | null;
    toWalletId?: string | null;

    amount: number;

    status?: TransactionStatus;
    paymentProvider?: PaymentProvider;
    paymentRefId?: string;

    metadata?: {
        tournamentId?: string;
        description?: string;
        [key: string]: unknown;
    };
}

export interface TransactionCheckDTO {
    type: TransactionType;
    metadata?: {
        tournamentId?: string;
        description?: string;
        [key: string]: unknown;
    };
    fromWalletId: string;
    status: TransactionStatus;
}
