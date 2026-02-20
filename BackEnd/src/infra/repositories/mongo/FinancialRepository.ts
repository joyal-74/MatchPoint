import { Types } from "mongoose";
import { IFinancialRepository, FinancialReport, DomainTransaction, WalletRepot } from "../../../app/repositories/interfaces/manager/IFinancialRepository.js"
import { WalletModel } from "../../databases/mongo/models/WalletModel.js";
import { TransactionModel } from "../../databases/mongo/models/TransactionModel.js";
import { TournamentModel } from "../../databases/mongo/models/TournamentModel.js";


interface PopulatedTournament {
    _id: Types.ObjectId;
    title: string;
}
export class FinancialRepository implements IFinancialRepository {

    async getManagerFinancialReport(managerId: string): Promise<FinancialReport> {
        const userId = new Types.ObjectId(managerId);
        const wallet = await WalletModel.findOne({ ownerId: userId, ownerType: 'USER' });

        if (!wallet) {
            return { balance: 0, currency: 'INR', transactions: [], tournaments: [] };
        }

        // Reuse the logic for transactions
        const transactions = await this.getMappedTransactions(wallet._id);

        // Fetch tournaments specifically for this full report
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

    /**
     * Returns ONLY balance and transactions (No Tournaments)
     */
    async getWalletReport(userId: string): Promise<WalletRepot> {
        const mongoUserId = new Types.ObjectId(userId);
        const wallet = await WalletModel.findOne({ ownerId: mongoUserId, ownerType: 'USER' });

        if (!wallet) {
            return {
                balance: 0,
                transactions: []
            };
        }


        const transactions = await this.getMappedTransactions(wallet._id);

        return {
            balance: wallet.balance,
            transactions
        };
    }

    /**
     * Private helper to fetch and map transactions for both methods
     */
    private async getMappedTransactions(walletId: Types.ObjectId): Promise<DomainTransaction[]> {
        const rawTransactions = await TransactionModel.find({
            $or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
            status: { $in: ['SUCCESS', 'FAILED', 'PENDING'] }
        })
            .populate('metadata.tournamentId', 'title')
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return rawTransactions.map(tx => {
            const populatedTournament = tx.metadata?.tournamentId as unknown as PopulatedTournament;
            const isCredit = tx.toWalletId?.toString() === walletId.toString();

            // 2. Map UI types based on your Schema Enum
            let uiType: 'income' | 'expense' | 'refund' = 'expense';

            if (tx.type === 'REFUND') {
                uiType = 'refund';
            } else if (tx.type === 'WITHDRAWAL') {
                uiType = 'expense';
            } else if (isCredit) {
                uiType = 'income';
            }else {
                uiType = 'expense';
            }

            return {
                id: tx._id.toString(),
                date: tx.createdAt,
                description: tx.metadata?.description || formatTxType(tx.type),
                tournament: populatedTournament?.title || 'General',
                type: uiType,
                amount: isCredit ? tx.amount : -tx.amount,
                status: tx.status.toLowerCase(),
                method: tx.paymentProvider
            };
        });
    }
}

function formatTxType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
