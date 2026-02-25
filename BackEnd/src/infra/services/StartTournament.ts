import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

import { IRegistrationRepository } from "../../app/repositories/interfaces/manager/IRegistrationRepository";
import { IPointsTableRepository } from "../../app/repositories/interfaces/shared/IPointsTableRepository";
import { ITournamentRepository } from "../../app/repositories/interfaces/shared/ITournamentRepository";
import { BadRequestError, NotFoundError } from "../../domain/errors/index";
import { IStartTournament } from "../../app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { PointsRow } from "../../domain/entities/PointsTable";

@injectable()
export class StartTournament implements IStartTournament {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.RegistrationRepository) private registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.PointsTableRepository) private pointsRepo: IPointsTableRepository
    ) { }

    async execute(tournamentId: string): Promise<void> {
        const tournament = await this.tournamentRepo.findById(tournamentId);
        if (!tournament) throw new NotFoundError("Tournament not found");
        if (tournament.status === 'ongoing') throw new BadRequestError("Tournament is already ongoing");

        const registrations = await this.registrationRepo.getPaidRegistrationsByTournament(tournamentId);

        if (registrations.length < tournament.minTeams) {
            throw new BadRequestError(`Not enough teams to start. Minimum ${tournament.minTeams} required.`);
        }

        interface PopulatedTeam {
            _id: string;
            name: string;
        }

        const initialRows: Omit<PointsRow, '_id'>[] = registrations.map((reg) => {
            const teamInfo = reg.teamId as unknown as PopulatedTeam;

            const teamId = teamInfo._id
                ? teamInfo._id.toString()
                : teamInfo.toString();

            // 2. Extract the Name
            const teamName = (reg as any)?.teamName || "Unknown Team";

            return {
                tournamentId: tournamentId,
                teamId: teamId,
                team: teamName,
                rank: 0, p: 0, w: 0, l: 0, t: 0, nrr: "0.000", pts: 0, form: []
            };
        });

        await this.pointsRepo.initializeTable(initialRows);

        // B. Update Tournament Status to 'ongoing'
        await this.tournamentRepo.update(tournamentId, { status: 'ongoing' });
    }
}
