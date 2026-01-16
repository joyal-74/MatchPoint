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

export interface LiveMatchCardDTO {
    matchId: string;

    teamA: {
        _id: string;
        name: string;
        logo: string;
    };

    teamB: {
        _id: string;
        name: string;
        logo: string;
    };

    scoreA: string;
    oversA: string;

    scoreB: string;
    oversB: string;

    isStreamLive: boolean;
}
