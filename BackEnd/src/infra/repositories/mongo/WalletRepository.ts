import { IWalletRepository, WalletCreateData } from "app/repositories/interfaces/shared/IWalletRepository";
import { Wallet } from "domain/entities/Wallet";
import { WalletModel } from "infra/databases/mongo/models/WalletModel";
import { ClientSession } from "mongoose";

export class WalletRepository implements IWalletRepository {
    async create(data: WalletCreateData, ctx?: unknown): Promise<Wallet> {
        const session = ctx as ClientSession | undefined;

        const [doc] = await WalletModel.create([data], { session });

        return new Wallet(
            doc._id.toString(),
            doc.ownerId.toString(),
            doc.ownerType,
            doc.balance,
            doc.currency,
            doc.isFrozen
        );
    }

    async getByOwner(ownerId: string, ownerType: 'USER' | 'TOURNAMENT' | 'ADMIN', ctx?: unknown) {
        const session = ctx as ClientSession;

        const doc = await WalletModel
            .findOne({ ownerId, ownerType })
            .session(session);

        if (!doc) throw new Error('Wallet not found');

        return new Wallet(
            doc._id.toString(),
            doc.ownerId.toString(),
            doc.ownerType,
            doc.balance,
            doc.currency,
            doc.isFrozen
        );
    }

    async debit(walletId: string, amount: number, ctx?: unknown) {
        const session = ctx as ClientSession;

        const res = await WalletModel.updateOne(
            { _id: walletId, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { session }
        );

        if (res.modifiedCount === 0) {
            throw new Error('Insufficient balance');
        }
    }

    async credit(walletId: string, amount: number, ctx?: unknown) {
        const session = ctx as ClientSession;

        await WalletModel.updateOne(
            { _id: walletId },
            { $inc: { balance: amount } },
            { session }
        );
    }
}
