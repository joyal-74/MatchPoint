export interface ITournamentRefundService {
    processFullRefunds(tournamentId: string, entryFee: string, reason: string): Promise<void>;
}
