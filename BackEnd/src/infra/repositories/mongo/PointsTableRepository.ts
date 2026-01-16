import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";
import { PointsRow } from "domain/entities/Tournaments";
import { PointsTableModel } from "infra/databases/mongo/models/PointsTableModel";

export class PointsTableRepository implements IPointsTableRepository {
    async findByTournamentId(id: string): Promise<PointsRow[]> {

        const rows = await PointsTableModel.find({ tournamentId: id })
            .sort({ rank: 1 })
            .exec();

        return rows;
    }

    async initializeTable(rows: PointsRow[]): Promise<void> {
        await PointsTableModel.insertMany(rows);
    }

    async updateTeamStats(teamName: string, stats: Partial<PointsRow>): Promise<void> {
        await PointsTableModel.updateOne(
            { team: teamName },
            { $set: stats }
        );
    }
}