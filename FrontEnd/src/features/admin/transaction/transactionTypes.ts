export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'ENTRY_FEE' | 'PRIZE' | 'COMMISSION' | 'REFUND' | 'SUBSCRIPTION';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentProvider = 'RAZORPAY' | 'STRIPE' | 'INTERNAL';

export interface WalletOwner {
    _id: string;
    name?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface TransactionStats {
    totalRevenue: number;
    totalVolume: number;
    pendingPayouts: number;
};

export interface Wallet {
    _id: string;
    ownerId: WalletOwner;
    ownerType: 'USER' | 'TOURNAMENT' | 'ADMIN';
    balance: number;
    currency: string;
    isFrozen: boolean;
}

export interface Transaction {
    _id: string;
    type: TransactionType;
    amount: number;
    paymentProvider: PaymentProvider;
    paymentRefId?: string;
    status: TransactionStatus;

    fromWalletId?: Wallet | null;
    toWalletId?: Wallet | null;

    metadata?: {
        tournamentId?: {
            _id: string;
            title: string;
        };
        description?: string;
    };

    createdAt: string;
    updatedAt: string;
}

export interface TransactionState {
    transactions: Transaction[];
    selectedTransaction : Transaction | null,
    loading: boolean;
    totalCount: number;
    stats: TransactionStats;
    error: string | null;
}