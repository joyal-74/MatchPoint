export interface BatsmanDto {
    playerId: string | null;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: string;
    out: boolean;
    dismissalType?: string | null;
    fielderId: string | null;
    isRetiredHurt: boolean;
}

export interface BowlerDto {
    playerId: string | null;
    runsConceded: number;
    wickets: number;
    balls: number;
    overs: number;
    economy: string;
}

export interface InningsDto {
    battingTeam: string | null;
    bowlingTeam: string | null;
    runs: number;
    wickets: number;
    legalBalls: number;
    deliveries: number;
    overs: number;
    currentRunRate: string;
    isCompleted: boolean;

    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;

    battingStats: BatsmanDto[];
    bowlingStats: BowlerDto[];

    extras: {
        wides: number;
        noBalls: number;
        byes: number;
        legByes: number;
        penalty: number;
    };

    recentLogs: any[];
}

export interface LiveScoreDto {
    matchId: string | null;
    tournamentId: string | null;

    status: string;
    currentInnings: number;
    oversLimit: number;

    target: number | null;
    requiredRuns: number | null;
    requiredRunRate: string | null;
    hasSuperOver: boolean;

    innings1: InningsDto | null;
    innings2: InningsDto | null;
}
