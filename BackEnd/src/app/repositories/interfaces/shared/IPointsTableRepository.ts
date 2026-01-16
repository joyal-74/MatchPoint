import { PointsRow } from "domain/entities/Tournaments";

export interface IPointsTableRepository {
    findByTournamentId(id: string): Promise<PointsRow[]>;

    initializeTable(rows: PointsRow[]): Promise<void>;

    updateTeamStats(tournamentId: string, teamId: string, stats: Partial<PointsRow>): Promise<void>
}