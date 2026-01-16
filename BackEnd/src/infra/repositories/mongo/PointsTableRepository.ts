import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";
import { PointsRow } from "domain/entities/Tournaments";
import { PointsTableModel } from "infra/databases/mongo/models/PointsTableModel";

export class PointsTableRepository implements IPointsTableRepository {
    
    async findByTournamentId(id: string): Promise<PointsRow[]> {
        return await PointsTableModel.find({ tournamentId: id })
            .sort({ pts: -1, nrr: -1 })
            .exec();
    }

    async initializeTable(rows: PointsRow[]): Promise<void> {
        await PointsTableModel.insertMany(rows);
    }

    async updateTeamStats(tournamentId: string, teamId: string, stats: Partial<PointsRow>): Promise<void> {
        await PointsTableModel.updateOne(
            { tournamentId: tournamentId, teamId: teamId },
            { $set: stats }
        );
    }
}