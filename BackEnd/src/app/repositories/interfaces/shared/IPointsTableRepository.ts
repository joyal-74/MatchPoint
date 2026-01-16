import { PointsRow } from "domain/entities/Tournaments";

export interface IPointsTableRepository {
    findByTournamentId(id: string): Promise<PointsRow[]>;

    initializeTable(rows: PointsRow[]): Promise<void>;

    updateTeamStats(teamId: string, stats: Partial<PointsRow>): Promise<void>;
}