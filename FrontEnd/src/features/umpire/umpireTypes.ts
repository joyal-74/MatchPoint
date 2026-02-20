export type MatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'bye';
export type TossDecision = 'Batting' | 'Bowling';

export interface TeamInMatch {
    _id: string;
    name: string;
    logo?: string;
}

export interface Extras {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
    total: number;
}

export interface InningsInfo {
    battingTeam: TeamInMatch;
    bowlingTeam: TeamInMatch;
    runs: number;
    wickets: number;
    legalBalls: number;
    oversLimit: number;
    extras?: Extras;
}

export interface Match {
    _id: string;
    matchId: string; // Used for routing/socket rooms
    matchNumber: string | number;
    tournamentId: string;
    
    // Team Data
    teamA: string | TeamInMatch; // Can be ID or Populated
    teamB: string | TeamInMatch;
    
    // Match Metadata
    date: string | Date;
    venue: string;
    status: MatchStatus;
    oversLimit: number;
    
    // Toss Info
    tossWinner?: string;
    tossDecision?: TossDecision;
    
    // Denormalized Scores (Used for Dashboard Cards)
    currentInnings: number;
    innings1?: InningsInfo;
    innings2?: InningsInfo | null;
    
    // Timestamps
    createdAt: string;
    updatedAt: string;
    
    // Winner Info (For completed matches)
    winner?: string | null;
    resultDescription?: string;
}

export interface UmpireState {
    allMatches: Match[];
    loading: boolean;
    error: string | undefined;
    totalPages: number | null;
}

export interface UmpireData {
    _id : string;
    firstName : string;
    lastName : string;
    profileImage : string;
    matches : string;
}