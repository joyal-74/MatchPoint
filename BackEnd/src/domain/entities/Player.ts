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