import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { BadRequestError } from "domain/errors";
import { ITournamentRegistrationValidator } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";

@injectable()
export class TournamentRegistrationValidator implements ITournamentRegistrationValidator {
    constructor(
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository
    ) { }

    async execute(tournamentId: string, attemptingTeamId: string): Promise<void> {
        const newTeam = await this._teamRepo.findById(attemptingTeamId);
        console.log(newTeam, " jjsakjfhsdgf")
        if (!newTeam) throw new BadRequestError("Team not found");

        const newPlayerIds = new Set(newTeam.members.map(m => String(m.userId)));


        const existingRegistrations = await this._registrationRepo.getTeamsByTournament(tournamentId);
        const registeredTeamIds = existingRegistrations.map(r => r.teamId);

        if (registeredTeamIds.length === 0) return;


        const conflictingTeam = await this._teamRepo.findTeamWithPlayers(
            registeredTeamIds,
            Array.from(newPlayerIds)
        );

        if (conflictingTeam) {
            const duplicate = conflictingTeam.members.find(m => newPlayerIds.has(String(m.userId)));
            throw new BadRequestError(
                `Player ${duplicate?.userId} is already registered in team '${conflictingTeam.name}'`
            );
        }
    }
}