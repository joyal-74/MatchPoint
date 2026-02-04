export interface Fixture {
    home: string;
    away: string;
}

export interface Round {
    roundNumber: number;
    matches: Fixture[];
}

export interface IFixtureGeneration {
    generateRoundRobinFixtures(teams: string[], includeReturnMatches: boolean): Round[];
}
