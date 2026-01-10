export interface LiveMatchDTO {
    matchId: string;
    tournamentId: string;
    tournamentName: string;

    teamA: string;
    teamB: string;
    teamAId: string;
    teamBId: string;

    runs: number;
    wickets: number;
    overs: number;
    status: string;
    venue: string;
    type: string;

    currentInningsNumber: number;
    isMatchComplete: boolean;
}