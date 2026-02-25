import { Types } from "mongoose";
import { RevenueChartPoint } from "../../../../domain/dtos/Analytics.dto";
import { AdminFilters } from "../../../../domain/dtos/Team.dto";
import { TransactionCheckDTO, TransactionCreateDTO } from "../../../../domain/dtos/Transaction.dto";
import { Transaction } from "../../../../domain/entities/Transaction";
import { IBaseRepository } from "../../IBaseRepository";

export interface TransactionStats {
    totalRevenue: number;
    totalVolume: number;
    pendingPayouts: number;
}

export interface TransactionReadModel extends Omit<Transaction, 'fromWalletId' | 'toWalletId'> {
    _id: string;
    fromWalletId?: { _id: string; userId: { name: string; email: string } } | null;
    toWalletId?: { _id: string; userId: { name: string; email: string } } | null;
    metadata?: { tournamentId?: { title: string }; description?: string };
}

export type PopulatedWallet = {
    _id: Types.ObjectId;
    userId: {
        name: string;
        email: string;
    };
};

export type PopulatedTransactionDoc = Omit<Transaction, 'fromWalletId' | 'toWalletId'> & {
    _id: Types.ObjectId;
    fromWalletId: PopulatedWallet | null;
    toWalletId: PopulatedWallet | null;
    metadata?: {
        tournamentId?: { title: string };
        description?: string;
    };
};

export interface ITransactionRepository extends IBaseRepository<TransactionCreateDTO, Transaction> {

    create(data: TransactionCreateDTO, ctx?: unknown): Promise<Transaction>;

    exists(data: TransactionCheckDTO, ctx?: unknown): Promise<boolean>;

    getStats(): Promise<TransactionStats>;

    getMonthlyStats(walletId: string, months: number): Promise<RevenueChartPoint[]>;

    findAllTransactions(filters: AdminFilters): Promise<{ data: TransactionReadModel[]; total: number }>;

    findByPaymentRef(refId: string): Promise<Transaction | null>;

    markAsSuccess(transactionId: string, finalPaymentId: string): Promise<void>;
}
