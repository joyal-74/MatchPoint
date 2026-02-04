export interface PlayerCareerStatsField {
    key: string;
    label: string;
    value: number;
}

export interface CareerStats {
    playerId: string;
    stats: Record<string, PlayerCareerStatsField[]>;
}
