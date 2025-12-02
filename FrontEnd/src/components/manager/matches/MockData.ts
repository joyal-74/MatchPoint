import type { MatchData, Player, Team, TeamId } from "./matchTypes";

const generatePlayer = (id: number, name: string): Player => ({
    id,
    name,
    stats: {
        totalMatch: 150,
        totalRuns: 6500,
        average: 45.2,
        strikeRate: 135.8,
    },
    // Placeholder image from placehold.co
    imageUrl: `https://placehold.co/40x40/2563EB/ffffff/png?text=P${id}`,
});

const MOCK_PLAYERS: Player[] = Array.from({ length: 15 }, (_, i) =>
    generatePlayer(i + 1, 'Star Player ' + (i + 1))
);

const MOCK_TEAMS: Record<TeamId, Team> = {
    red_giants: {
        id: 'red_giants',
        name: 'Red Giants',
        color: 'red',
        playingXI: MOCK_PLAYERS.slice(0, 11).map((p, i) => generatePlayer(i + 1, 'R. Player ' + (i + 1))),
        substitutions: MOCK_PLAYERS.slice(11).map((p, i) => generatePlayer(i + 4, 'R. Sub ' + (i + 1))),
    },
    blue_tigers: {
        id: 'blue_tigers',
        name: 'Blue Tigers',
        color: 'blue',
        playingXI: MOCK_PLAYERS.slice(0, 11).map((p, i) => generatePlayer(i + 1, 'B. Player ' + (i + 1))),
        substitutions: MOCK_PLAYERS.slice(11).map((p, i) => generatePlayer(i + 8, 'B. Sub ' + (i + 1))),
    },
};

export const MOCK_MATCH_DATA: MatchData = {
    matchNo: 10,
    team1: MOCK_TEAMS.blue_tigers,
    team2: MOCK_TEAMS.red_giants,
    venue: 'Kochi, Kerala',
    date: '12/10/2025',
    time: '7 PM',
    overs: 10,
};