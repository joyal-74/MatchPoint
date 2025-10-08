export interface Fixture {
    home: string;
    away: string;
}

export interface Round {
    roundNumber: number;
    matches: Fixture[];
}