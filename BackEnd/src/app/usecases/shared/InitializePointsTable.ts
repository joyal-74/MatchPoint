
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";
import { PointsRow } from "domain/entities/Tournaments";

export class InitializePointsTable {
    constructor(
        private pointsRepo: IPointsTableRepository,
        private registrationRepo: IRegistrationRepository
    ) {}

    async execute(tournamentId: string): Promise<void> {
        const registrations = await this.registrationRepo.getPaidRegistrationsByTournament(tournamentId);

        if (!registrations || registrations.length === 0) {
            console.warn(`No teams found for tournament ${tournamentId}. Skipping table creation.`);
            return;
        }

        const emptyRows: PointsRow[] = registrations.map((reg) => {
            const teamName = (reg.teamId).name || "Unknown Team";

            return {
                tournamentId: tournamentId,
                team: teamName,
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