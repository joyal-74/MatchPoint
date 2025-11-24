import { IFixtureGeneration, Round } from "app/providers/FixtureGeneration";

export class FixtureGeneration implements IFixtureGeneration {
    constructor() { }

    generateRoundRobinFixtures(teams: string[], includeReturnMatches: boolean): Round[] {
        let currentTeams = [...teams];
        if (currentTeams.length % 2 !== 0) {
            currentTeams.push('BYE'); 
        }
        const n = currentTeams.length;
        const fixtures: Round[] = [];

        for (let roundNum = 0; roundNum < n - 1; roundNum++) {
            const roundMatches: Fixture[] = [];
            for (let i = 0; i < n / 2; i++) {
                const home = currentTeams[i];
                const away = currentTeams[n - 1 - i];
                if (home !== 'BYE' && away !== 'BYE') {
                    roundMatches.push({ home, away });
                }
            }
            fixtures.push({ roundNumber: roundNum + 1, matches: roundMatches });

            // Rotate: Fix first, move last to second
            currentTeams = [
                currentTeams[0],
                ...currentTeams.slice(n - 1, n),
                ...currentTeams.slice(1, n - 1),
            ];
        }

        // Double round-robin: Reverse home/away for return legs
        if (includeReturnMatches) {
            const returnFixtures = fixtures.map((round) => ({
                ...round,
                matches: round.matches.map(({ home, away }) => ({ home: away, away: home })),
            }));
            fixtures.push(...returnFixtures.map((r, i) => ({ ...r, roundNumber: r.roundNumber + fixtures.length })));
        }

        return fixtures;
    }
}