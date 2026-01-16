import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { BadRequestError, NotFoundError } from "domain/errors";
import { IStartTournament } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";

@injectable()
export class StartTournament implements IStartTournament {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.RegistrationRepository) private registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.PointsTableRepository) private pointsRepo: IPointsTableRepository
    ) { }

    async execute(tournamentId: string): Promise<void> {
        // 1. Validate Tournament
        const tournament = await this.tournamentRepo.findById(tournamentId);
        if (!tournament) throw new NotFoundError("Tournament not found");
        if (tournament.status === 'ongoing') throw new BadRequestError("Tournament is already ongoing");

        // 2. Fetch Confirmed Teams (The Logic we discussed)
        const registrations = await this.registrationRepo.getPaidRegistrationsByTournament(tournamentId);

        if (registrations.length < tournament.minTeams) {
            throw new BadRequestError(`Not enough teams to start. Minimum ${tournament.minTeams} required.`);
        }

        // 3. Prepare Points Table Data
        const initialRows = registrations.map((reg) => ({
            tournamentId: tournamentId,
            teamId: reg.teamId,
            team: reg.teamId.name,
            rank: 0, p: 0, w: 0, l: 0, t: 0, nrr: "0.000", pts: 0, form: []
        }));
       
        await this.pointsRepo.initializeTable(initialRows);

        // B. Update Tournament Status to 'ongoing'
        await this.tournamentRepo.update(tournamentId, { status: 'ongoing' });
    }
}