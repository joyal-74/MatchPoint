import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IGetPointsTableUseCase } from "../../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { IPointsTableRepository } from "../../../repositories/interfaces/shared/IPointsTableRepository.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { PointsTableResponse } from "../../../../domain/entities/PointsTable.js";


@injectable()
export class GetPointsTableUseCase implements IGetPointsTableUseCase {
    constructor(
        @inject(DI_TOKENS.PointsTableRepository) private _pointsRepository: IPointsTableRepository,
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepository: ITournamentRepository
    ) {}

    async execute(tournamentId: string): Promise<PointsTableResponse> {
        const tournament = await this._tournamentRepository.findById(tournamentId);
        if (!tournament) throw new Error("Tournament not found");

        const rows = await this._pointsRepository.findByTournamentId(tournamentId);

        if (tournament.format === 'groups') {
            return this.formatForGroups(rows);
        }

        // Default: League Format (Flat table)
        return { table: rows };
    }

    private formatForGroups(rows: any[]) {

        const groupsMap = new Map<string, any[]>();

        rows.forEach(row => {
            const gName = row.groupName || "Unassigned";
            if (!groupsMap.has(gName)) {
                groupsMap.set(gName, []);
            }
            groupsMap.get(gName)?.push(row);
        });

        const groupsData = Array.from(groupsMap.entries()).map(([name, teamRows]) => ({
            groupName: name,
            rows: teamRows
        }));

        return { groups: groupsData };
    }
}
