export interface Player {
    _id: string;
    name: string;
    role: string;
    status: string;
    profileImage?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    stats: Record<string, any>;
}

export interface Team {
    _id: string;
    name: string;
    members: Player[];
    logo?: string;
}

export type MatchStatus = "upcoming" | "live" | "completed";

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
    stats?: Record<string, any>;
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

// History of a single ball event
export interface BallEvent {
    over: number;
    ball: number;
    runs: number;
    extra: 'wide' | 'noBall' | 'legBye' | 'bye' | null;
    wicket: boolean;
    dismissalType: string | null;
    batsmanId: string;
    bowlerId: string;
}

// Defines the state for a single innings
export interface InningsState {
    battingTeamId: string;
    bowlingTeamId: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;
    currentRunRate : string;
    isCompleted: boolean;
    ballEvents: BallEvent[];
    // Stats for players currently participating/who have participated
    battingStats: Record<string, Omit<PlayerStats, 'overs' | 'maidens' | 'wickets' | 'runsConceded'>>;
    bowlingStats: Record<string, Omit<PlayerStats, 'runs' | 'balls' | 'fours' | 'sixes' | 'dismissal'>>;
    extras : MatchExtras
}

export interface LiveScoreState {
    innings1: InningsState;
    innings2: InningsState | null;
    currentInnings: 1 | 2;
    requiredRuns: number;
    target: number;
    currentRunRate: number;
    requiredRunRate: number;
}

export interface BattingStats {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    dismissal: string;
}

// --- Derived Bowling Statistics ---
export interface BowlingStats {
    overs: number; 
    maidens: number;
    wickets: number;
    runsConceded: number;
}