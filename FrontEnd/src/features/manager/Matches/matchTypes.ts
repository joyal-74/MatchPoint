export interface Player {
    _id: string;
    userId: string;
    name: string;
    role: string;
    status: string;
    profileImage?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    stats: Record<string, string | number | boolean>;
}

export interface Team {
    _id: string;
    name: string;
    members: Player[];
    logo?: string;
}

export type MatchStatus = "upcoming" | "ongoing" | "completed";

export interface MatchExtras {
    wides: number;
    noBalls: number;
    legByes: number;
    byes: number;
    penalty: number;
    total: number;
}

export interface Match {
    _id: string;
    tournamentId: string;
    tournamentName : string;
    matchNumber: string;
    round: number;
    date: string;
    venue: string;
    tossWinner: string | null;
    tossDecision: 'Batting' | 'Bowling' | null;
    status: MatchStatus;
    winner: string;
    teamA: Team;
    teamB: Team;
    stats?: Record<string, string | number | boolean>;
    overs: number;
}

export interface PlayerStats {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    dismissal: string;
    overs: number;
    maidens: number;
    wickets: number;
    runsConceded: number;
}

export interface BallEvent {
    over: number;
    ball: number;
    runs: number;
    extra: 'wide' | 'noBall' | 'legBye' | 'bye' | null;
    wicket: boolean;
    dismissalType: string | null;
    batsmanId: string;
    bowlerId: string;
    isLegalBall?: boolean;
}

export interface InningsState {
    battingTeam: string;
    bowlingTeam: string;
    runs: number;
    wickets: number;
    overLimit: number;
    legalBalls: number;
    deliveries: number;
    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;
    currentRunRate: string;
    isCompleted: boolean;
    ballEvents: BallEvent[];
    recentLogs: BallEvent[];
    battingStats: BattingStats[];
    bowlingStats: BowlingStats[];
    extras: MatchExtras;
}

export interface LiveScoreState {
    innings1: InningsState;
    innings2: InningsState | null;
    currentInnings: 1 | 2;
    requiredRuns: number;
    target: number;
    currentRunRate: number;
    requiredRunRate: number;
    status : string;
    result : string;
}

export interface BattingStats {
    playerId: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    dismissal: string;
    out: boolean;
    strikeRate : string;
}

export interface BowlingStats {
    playerId: string;
    overs: number;
    balls : number;
    maidens: number;
    wickets: number;
    runsConceded: number;
    economy: number;
}

export interface InningsSummary {
    runs: number;
    wickets: number;
    legalBalls: number;
    deliveries: number;
    overs: string;
    currentRunRate: number;
    extras: MatchExtras;
}

export interface PlayerInningsStats {
    playerId: string;
    batting?: {
        runs: number;
        balls: number;
        fours: number;
        sixes: number;
        strikeRate: number;
        out: boolean;
        dismissalType?: string;
    };
    bowling?: {
        overs: number;
        maidens: number;
        wickets: number;
        runsConceded: number;
        economy: number;
        deliveries: number;
    };
}