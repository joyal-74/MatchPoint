export type PlayerRole = 'WK' | 'Batter' | 'Bowler' | 'Allrounder';
export type TimePeriod = "All Time" | "2024" | "2023" | "2022" | "2021" | "2020";


export interface LeaderboardRow {
    Rank: number;
    Name: string;
    Match: number;
    Role: PlayerRole;
    Runs: string;
    '100': number | string;
    '50': number | string;
    'Bat. average': number;
    'Strike rate': number;
    Best: string;
}

export interface TopPlayerStats {
    name: string;
    handle: string;
    matches: number;
    runs: string;
    average: number;
    hundreds: number;
    fifties: number;
    strikeRate: number;
    isCentury: boolean;
}