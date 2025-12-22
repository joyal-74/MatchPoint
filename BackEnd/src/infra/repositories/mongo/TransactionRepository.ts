import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { TransactionCheckDTO, TransactionCreateDTO } from "domain/dtos/Transaction.dto";
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
}