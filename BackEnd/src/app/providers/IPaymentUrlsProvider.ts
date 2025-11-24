export interface IPaymentUrlProvider {
    getSuccessUrl(tournamentId: string, teamId: string): string;
    getCancelUrl(tournamentId: string, teamId: string): string;
}
