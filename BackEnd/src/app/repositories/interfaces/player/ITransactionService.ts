export interface ITransactionService {
    chargeEntryFee(params: { playerUserId: string; tournamentId: string; amount: number; description?: string; }): Promise<void>;
}
