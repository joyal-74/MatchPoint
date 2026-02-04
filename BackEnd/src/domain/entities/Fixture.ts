export type FixtureFormat = 'knockout' | 'league' | 'friendly';
export type MatchStatus = 'ongoing' | 'completed' | 'upcoming' | "bye";


interface Match {
    matchId: string;
    round: number;
}

export interface Fixture {
    _id?: string;
    tournamentId: string;
    format: FixtureFormat;
    matches: Match[];
    createdAt?: Date;
}
