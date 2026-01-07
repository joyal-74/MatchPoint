import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { BadRequestError } from "domain/errors";

@injectable()
export class TournamentRegistrationValidator {
    constructor(
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository
    ) { }

    async execute(tournamentId: string, attemptingTeamId: string): Promise<void> {
        const newTeam = await this._teamRepo.findById(attemptingTeamId);
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