import { PopulatedTransactionDoc, TransactionReadModel } from "../../../app/repositories/interfaces/shared/ITransactionRepository.js";
import { Transaction } from "../../../domain/entities/Transaction.js";

export class TransactionMapper {
    static toDomain(doc: any): Transaction {
        return {
            ...doc,
            _id: doc._id.toString(),
            fromWalletId: doc.fromWalletId?.toString() || null,
            toWalletId: doc.toWalletId?.toString() || null,
        } as Transaction;
    }

    static toReadModel(doc: PopulatedTransactionDoc): TransactionReadModel {
        // Safe access to nested populated ownerId
        const fromOwner = (doc.fromWalletId as any)?.ownerId;
        const toOwner = (doc.toWalletId as any)?.ownerId;

        return {
            ...doc,
            _id: doc._id.toString(),
            fromWalletId: doc.fromWalletId ? {
                _id: doc.fromWalletId._id.toString(),
                userId: {
                    name: fromOwner ? `${fromOwner.firstName} ${fromOwner.lastName}`.trim() : 'Unknown',
                    email: fromOwner?.email || 'N/A'
                }
            } : null,
            toWalletId: doc.toWalletId ? {
                _id: doc.toWalletId._id.toString(),
                userId: {
                    name: toOwner ? `${toOwner.firstName} ${toOwner.lastName}`.trim() : 'Unknown',
                    email: toOwner?.email || 'N/A'
                }
            } : null,
            metadata: doc.metadata ? {
                tournamentId: doc.metadata.tournamentId ? {
                    title: doc.metadata.tournamentId.title
                } : undefined,
                description: doc.metadata.description
            } : undefined
        };
    }

    static toReadModelArray(docs: PopulatedTransactionDoc[]): TransactionReadModel[] {
        return docs.map(doc => this.toReadModel(doc));
    }
}