import { ITransactionRepository, TransactionStats } from "app/repositories/interfaces/shared/ITransactionRepository";
import { AdminFilters } from "domain/dtos/Team.dto";
import { TransactionCheckDTO, TransactionCreateDTO } from "domain/dtos/Transaction.dto";
import { Transaction } from "domain/entities/Transaction";
import { TransactionModel } from "infra/databases/mongo/models/TransactionModel";
import { ClientSession, FilterQuery } from "mongoose";


export class TransactionRepository implements ITransactionRepository {
    async create(data: TransactionCreateDTO, ctx?: unknown): Promise<void> {

        const session = ctx as ClientSession | undefined;

        await TransactionModel.create(
            [
                {
                    type: data.type,
                    fromWalletId: data.fromWalletId ?? null,
                    toWalletId: data.toWalletId ?? null,
                    amount: data.amount,
                    status: data.status ?? 'PENDING',
                    paymentProvider: data.paymentProvider ?? 'INTERNAL',
                    paymentRefId: data.paymentRefId,
                    metadata: this.mapMetadata(data.metadata)
                }
            ],
            { session }
        );
    }

    async exists(data: TransactionCheckDTO, ctx?: unknown): Promise<boolean> {
        const session = ctx as ClientSession | undefined;

        const query: Record<string, unknown> = {
            type: data.type,
            fromWalletId: data.fromWalletId,
            status: data.status
        };


        if (data.metadata) {
            Object.keys(data.metadata).forEach((key) => {
                const value = data.metadata![key];
                if (value !== undefined) {
                    query[`metadata.${key}`] = value;
                }
            });
        }


        const result = await TransactionModel.exists(
            query as FilterQuery<typeof TransactionModel>
        ).session(session || null);

        return !!result;
    }

    private mapMetadata(metadata?: Record<string, unknown>) {
        if (!metadata) return undefined;

        return {
            ...metadata,
            tournamentId: metadata.tournamentId
                ? metadata.tournamentId
                : undefined
        };
    }

    async findById(id: string): Promise<Transaction | null> {
        const doc = await TransactionModel.findById(id)
            .populate({
                path: 'fromWalletId',
                populate: {
                    path: 'ownerId',
                    select: 'firstName lastName name title email'
                }
            })
            .populate({
                path: 'toWalletId',
                populate: {
                    path: 'ownerId',
                    select: 'firstName lastName name title email'
                }
            })
            .populate('metadata.tournamentId', 'title')
            .exec();

        if (!doc) return null;

        return doc.toObject() as unknown as Transaction;
    }

    async findAll(filters: AdminFilters): Promise<{ data: Transaction[]; total: number; }> {
        const { page, limit, search, filter } = filters;
        const skip = (page - 1) * limit;

        const query: FilterQuery<typeof TransactionModel> = {};

        if (filter && filter !== 'All') {
            query.type = filter;
        }

        if (search) {
            query.$or = [
                { paymentRefId: { $regex: search, $options: 'i' } },
                { 'metadata.description': { $regex: search, $options: 'i' } }
            ];
        }

        const [docs, total] = await Promise.all([
            TransactionModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'fromWalletId',
                    populate: {
                        path: 'ownerId',
                        select: 'firstName lastName name title email'
                    }
                })
                .populate({
                    path: 'toWalletId',
                    populate: {
                        path: 'ownerId',
                        select: 'firstName lastName name title email'
                    }
                })
                .populate('metadata.tournamentId', 'title')
                .exec(),
            TransactionModel.countDocuments(query)
        ]);

        return {
            data: docs as unknown as Transaction[],
            total
        };
    }

    async getStats(): Promise<TransactionStats> {
        const results = await TransactionModel.aggregate([
            {
                $facet: {
                    revenue: [
                        { $match: { type: { $in: ['SUBSCRIPTION'] }, status: 'SUCCESS' } },
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ],
                    volume: [
                        { $match: { type: 'ENTRY_FEE', status: 'SUCCESS' } },
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ],
                    pendingPayouts: [
                        { $match: { type: 'WITHDRAWAL', status: 'PENDING' } },
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ]
                }
            }
        ]);

        const stats = results[0];

        return {
            totalRevenue: stats.revenue[0]?.total || 0,
            totalVolume: stats.volume[0]?.total || 0,
            pendingPayouts: stats.pendingPayouts[0]?.total || 0
        };
    }
}