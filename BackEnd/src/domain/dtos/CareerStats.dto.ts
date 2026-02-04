export interface CareerStatsResponseDTO {
    playerId: string;
    stats: Record<string, { key: string; label: string; value: number | null }[]>;
}
