export interface Player {
    id: number;
    name: string;
}

export interface BatsmanStats extends Player {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isStriker: boolean;
    outDescription: string | null;
}

export interface BowlerStats extends Player {
    overs: number;
    maidens: number;
    runsConceded: number;
    wickets: number;
}

export interface TeamScore {
    name: string;
    totalRuns: number;
    wickets: number;
    overs: number;
    batsmen: BatsmanStats[];
    currentBowler: BowlerStats;
}

export interface MatchState {
    currentInnings: 'TeamA' | 'TeamB';
    lastFiveBalls: (number | 'W' | 'Nb' | 'Wd' | '0')[];
    innings1: InningsDetails | null;
    innings2: InningsDetails | null;

    teamA: TeamScore;
    teamB: TeamScore;

    matchResult: string | null;
}


export interface InningsDetails {
    name: string; // Team Name
    totalRuns: number;
    wickets: number;
    overs: number; // Final overs bowled
    batsmenScore: BatsmanStats[]; // All players who batted/were listed
    bowlersScore: BowlerStats[]; // All players who bowled
    extras: {
        wides: number;
        noBalls: number;
        byes: number;
        legByes: number;
    }
}

// Define the handler function type for passing down to the control panel
export type ScoreUpdateHandler = (type: 'run' | 'extra' | 'wicket' | 'swap' | 'retire' | 'undo', value?: number) => void;