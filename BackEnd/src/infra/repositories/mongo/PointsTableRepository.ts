import { IPointsTableRepository } from "../../../app/repositories/interfaces/shared/IPointsTableRepository.js";
import { PointsRow } from "../../../domain/entities/PointsTable.js";
import { PointsTableModel } from "../../databases/mongo/models/PointsTableModel.js";


export class PointsTableRepository implements IPointsTableRepository {

    async findByTournamentId(id: string): Promise<PointsRow[]> {
        const docs = await PointsTableModel.find({ tournamentId: id })
            .sort({ pts: -1, nrr: -1 })
            .lean()
            .exec();

        return docs.map(doc => ({
            ...doc,
            _id: doc._id.toString(),
            tournamentId: doc.tournamentId.toString(),
            teamId: doc.teamId.toString(),
            teamName: doc.team,
        }));
    }

    async initializeTable(rows: Omit<PointsRow, '_id'>[]): Promise<void> {
        await PointsTableModel.insertMany(rows);
    }

    async updateTeamStats(tournamentId: string, teamId: string, stats: Partial<PointsRow>): Promise<void> {
        await PointsTableModel.updateOne(
            { tournamentId: tournamentId, teamId: teamId },
            { $set: stats }
        );
    }
}
