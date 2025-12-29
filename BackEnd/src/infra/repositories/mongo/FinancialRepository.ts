import { Types } from "mongoose";
import { IFinancialRepository, FinancialReport, DomainTransaction } from "../../../app/repositories/interfaces/manager/IFinancialRepository"
import { WalletModel } from "infra/databases/mongo/models/WalletModel";
import { TransactionModel } from "infra/databases/mongo/models/TransactionModel";
import { TournamentModel } from "infra/databases/mongo/models/TournamentModel";


export class FinancialRepository implements IFinancialRepository {
    
    async getManagerFinancialReport(managerId: string): Promise<FinancialReport> {
        const userId = new Types.ObjectId(managerId);

        // 1. Get Manager's Wallet
        const wallet = await WalletModel.findOne({ ownerId: userId, ownerType: 'USER' });
        
        if (!wallet) {
            return {
                balance: 0,
                currency: 'INR',
                transactions: [],
                tournaments: []
            };
        }

        // 2. Get Transactions 
        const rawTransactions = await TransactionModel.find({
            $or: [
                { fromWalletId: wallet._id },
                { toWalletId: wallet._id }
            ]
        })
        .populate('metadata.tournamentId', 'title')
        .sort({ createdAt: -1 })
        .limit(100);

        const transactions: DomainTransaction[] = rawTransactions.map(tx => {
            const isCredit = tx.toWalletId?.toString() === wallet._id.toString();
            
            // Determine UI Type logic
            let type: 'income' | 'expense' | 'refund' = 'expense';
            
            if (tx.type === 'REFUND') {
                type = 'refund';
            } else if (isCredit) {
                type = 'income';
            } else {
                type = 'expense';
            }

            return {
                id: tx._id.toString(),
                date: tx.createdAt,
                description: tx.metadata?.description || formatTxType(tx.type),
                tournament: (tx.metadata?.tournamentId)?.title || 'General', 
                type: type,
                amount: isCredit ? tx.amount : -tx.amount,
                status: tx.status.toLowerCase(),
                method: tx.paymentProvider
            };
        });


        const rawTournaments = await TournamentModel.find({ managerId: userId })
            .select('title plan entryFee minTeams currTeams status');

        const tournaments = rawTournaments.map(t => ({
            id: t._id.toString(),
            name: t.title,
            plan: 'Basic', 
            entryFee: Number(t.entryFee),
            minTeams: t.minTeams,
            currentTeams: t.currTeams,
            status: t.status
        }));

        return {
            balance: wallet.balance,
            currency: wallet.currency,
            transactions,
            tournaments
        };
    }
}

function formatTxType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}