import { IWalletRepository } from "app/repositories/interfaces/IWalletRepository";
import { UserModel } from "infra/databases/mongo/models/UserModel";

export class WalletRepository implements IWalletRepository {
    async getBalance(userId: string): Promise<number> {
        const user = await UserModel.findById(userId);
        return user?.wallet || 0;
    }

    async deductBalance(userId: string, amount: number): Promise<void> {
        await UserModel.updateOne({ _id: userId }, { $inc: { wallet: -amount } });
    }
}