import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { BadRequestError } from "domain/errors";

export class TournamentRegistrationValidator {
    constructor(
        private _registrationRepo: IRegistrationRepository,
        private _teamRepo: ITeamRepository
    ) { }

    async execute(tournamentId: string, teamId: string): Promise<void> {
        const existingRegistrations = await this._registrationRepo.getTeamsByTournament(tournamentId);
        const registeredTeamIds = existingRegistrations.map(r => r.teamId);

        const registeredPlayers = new Set<string>();
        for (const tId of registeredTeamIds) {
            const team = await this._teamRepo.findById(tId);
            team?.members.forEach(p => registeredPlayers.add(String(p.userId)));
        }

        const newTeam = await this._teamRepo.findById(teamId);
        const duplicatePlayers = newTeam?.members.filter(p => registeredPlayers.has(String(p.userId)));

        if (duplicatePlayers && duplicatePlayers.length > 0) {
            const names = duplicatePlayers.map(p => p.userId).join(", ");
            throw new BadRequestError(`Players already registered in another team for this tournament: ${names}`);
        }
    }
}
