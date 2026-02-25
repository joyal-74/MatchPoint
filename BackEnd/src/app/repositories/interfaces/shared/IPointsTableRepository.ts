import { PointsRow } from "../../../../domain/entities/PointsTable";

export interface IPointsTableRepository {
    findByTournamentId(id: string): Promise<PointsRow[]>;

    initializeTable(rows: Omit<PointsRow, '_id'>[]): Promise<void>;
    
    updateTeamStats(tournamentId: string, teamId: string, stats: Partial<PointsRow>): Promise<void>
}
