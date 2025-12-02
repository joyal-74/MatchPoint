export interface Player {
    id: number;
    name: string;
    stats: {
        totalMatch: number;
        totalRuns: number;
        average: number;
        strikeRate: number;
    };
    imageUrl: string;
}

export interface Team {
    id: string;
    name: string;
    color: 'red' | 'blue';
    playingXI: Player[];
    substitutions: Player[];
}

export interface MatchData {
    matchNo: number;
    team1: Team;
    team2: Team;
    venue: string;
    date: string;
    time: string;
    overs: number;
}

export type TossDecision = 'Batting' | 'Bowling' | null;
export type TeamId = 'red_giants' | 'blue_tigers';