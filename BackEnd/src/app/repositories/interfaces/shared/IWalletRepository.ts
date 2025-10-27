export interface IWalletRepository {
    getBalance(userId: string): Promise<number>;
    deductBalance(userId: string, amount: number): Promise<void>;
}