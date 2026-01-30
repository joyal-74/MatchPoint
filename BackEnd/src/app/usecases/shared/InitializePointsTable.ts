import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";
import { PointsRow } from "domain/entities/PointsTable";

interface PopulatedTeam {
    _id: string;
    name: string;
}

export class InitializePointsTable {
    constructor(
        private pointsRepo: IPointsTableRepository,
        private registrationRepo: IRegistrationRepository
    ) { }

    async execute(tournamentId: string): Promise<void> {
        const registrations = await this.registrationRepo.getPaidRegistrationsByTournament(tournamentId);

        if (!registrations || registrations.length === 0) {
            console.warn(`No teams found for tournament ${tournamentId}. Skipping table creation.`);
            return;
        }

        const emptyRows: Omit<PointsRow, '_id'>[] = registrations.map((reg) => {
            const teamInfo = reg.teamId as unknown as PopulatedTeam;

            return {
                tournamentId: tournamentId,
                teamId: teamInfo._id,
                teamName: teamInfo.name,
                team: teamInfo.name,
                rank: 0,
                p: 0,
                w: 0,
                l: 0,
                t: 0,
                nrr: "0.000",
                pts: 0,
                form: []
            };
        });

        await this.pointsRepo.initializeTable(emptyRows);
    }
}