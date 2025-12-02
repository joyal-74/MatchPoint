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

export interface LeaderboardRow {
    Rank: number;
    Name: string;
    Match: number;
    Role: "Batter" | "Bowler" | "Allrounder" | "WK";
    Runs: string;
    "100": number | "-";
    "50": number | "-";
    "Bat. average": number;
    "Strike rate": number;
    Best: string;
}

export type PlayerRole = "Batter" | "Bowler" | "Allrounder";
export type TimePeriod = "All Time" | "2024" | "2023" | "2022" | "2021" | "2020";
