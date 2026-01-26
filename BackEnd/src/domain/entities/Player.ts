export interface Player {
    _id: string;
    userId: string;
    sport: string;
    profile: Record<string, string | number | boolean | null>;
    stats: Record<string, number>;
}

export interface PlayerRegister {
    userId: string;
    sport: string;
    profile: Record<string, string | number | boolean | null>;
    stats: Record<string, Record<string, number>>;
}

export interface PlayerResponse extends Omit<Player, "stats"> {
    _id: string;
}

interface UserDetails {
    firstName : string;
    lastName : string;
}

export interface PopulatedPLayer {
    _id: string;
    userId: UserDetails;
    sport: string;
    profile: Record<string, string | number | boolean | null>;
    stats: Record<string, number>;
}


export interface LeaderBoardPlayer {
    name: string;
    handle: string;
    matches: number;
    runs: string;
    average: number;
    hundreds: number;
    fifties: number;
    strikeRate: number;
    role: "Batter" | "Bowler" | "Allrounder" | "WK";
    best: string;
}

export interface PlayerEntity {
    _id: string;
    userId: string;
    name: string;
    role: string;
    profileImage?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    stats: Record<string, number>;
}