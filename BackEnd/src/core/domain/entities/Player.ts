export interface PlayerProfileField {
    key: string;
    label: string;
    type: string;
    value?: any;
}

export interface PlayerCareerStatsField {
    key: string;
    label: string;
    value: number;
}

export interface CareerStats {
    playerId: string;
    stats: Record<string, PlayerCareerStatsField[]>;
}

export interface Player {
    _id : string;
    userId: string;
    sport: string;
    profile: PlayerProfileField[];
    career_stats: Record<string, PlayerCareerStatsField[]>;
}

