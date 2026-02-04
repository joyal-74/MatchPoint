import { RevenueChartPoint } from "../../../../domain/dtos/Analytics.dto.js";
import { AdminFilters } from "../../../../domain/dtos/Team.dto.js";
import { TransactionCheckDTO, TransactionCreateDTO } from "../../../../domain/dtos/Transaction.dto.js";
import { Transaction } from "../../../../domain/entities/Transaction.js";

export interface TransactionStats {
    totalRevenue: number;
    totalVolume: number;
    pendingPayouts: number;
}

export interface TransactionReadModel extends Omit<Transaction, 'fromWalletId' | 'toWalletId'> {
    fromWalletId?: { _id: string; userId: { name: string; email: string } } | null;
    toWalletId?: { _id: string; userId: { name: string; email: string } } | null;
    metadata?: { tournamentId?: { title: string }; description?: string };
}


export interface ITransactionRepository {
    create(data: TransactionCreateDTO, ctx?: unknown): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    findAll(filters: AdminFilters): Promise<{ data: Transaction[]; total: number }>;
    exists(data: TransactionCheckDTO, ctx?: unknown): Promise<boolean>;
    getStats(): Promise<TransactionStats>;
    getMonthlyStats(walletId: string, months: number): Promise<RevenueChartPoint[]>;
}
