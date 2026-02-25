import { Wallet } from "../../../../domain/entities/Wallet";

export interface WalletCreateData {
    ownerId: string;
    ownerType: 'USER' | 'TOURNAMENT' | 'ADMIN';
    balance: number;
    currency: string;
    isFrozen: boolean;
}

export interface WalletCreditData {
    userId: string;
    amount: number;
    description: string;
    transactionType: 'refund' | 'deposit' | 'winnings' | 'transfer';
}

export interface IWalletRepository {
    create(wallet: WalletCreateData, ctx?: unknown): Promise<Wallet>;

    getByOwner(ownerId: string, ownerType: 'USER' | 'TOURNAMENT' | 'ADMIN', ctx?: unknown): Promise<Wallet>;

    credit(walletId: string, amount: number, ctx?: unknown): Promise<void>;

    creditAmount(data: WalletCreditData, ctx?: unknown): Promise<void>;

    debit(walletId: string, amount: number, ctx?: unknown): Promise<void>;
}
