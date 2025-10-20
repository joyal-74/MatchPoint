export interface Round {
    roundNumber: number;
    matches: Fixture[];
}


export type FixtureFormat = 'knockout' | 'league' | 'friendly';
export type MatchStatus = 'ongoing' | 'completed' | 'upcoming' | "bye";

export interface Match {
    matchNumber: number;
    teamA: string;
    teamB: string | null;
    round?: number;
    date?: Date;
    status: MatchStatus;
    result?: {
        teamAScore: number;
        teamBScore: number;
    };
    winner: string;
}



export interface Fixture {
    _id?: string;
    tournamentId: string;
    format: FixtureFormat;
    matches: Match[];
    createdAt?: Date;
}