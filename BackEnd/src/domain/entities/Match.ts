export interface Match {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    tournamentId: string;
    date: Date;
    venueId?: string;
    round: number;
}