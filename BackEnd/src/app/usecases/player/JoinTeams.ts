import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IJoinTeamUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamData } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";

export class JoinTeamUseCase implements IJoinTeamUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(playerId: string, teamId: string): Promise<TeamData> {
        this._logger.info(`Player ${playerId} attempting to join team ${teamId}`);

        const team = await this._teamRepo.findById(teamId);
        if (!team) throw new NotFoundError("Team not found");

        const alreadyMember = team.members.some(m => m.playerId === playerId);
        if (alreadyMember) throw new BadRequestError("Player already in this team");

        if (team.members.length >= team.maxPlayers)
            throw new Error("Team is full");

        const updatedTeam = await this._teamRepo.addMember(teamId, playerId);
        this._logger.info(`Player ${playerId} successfully joined team ${teamId}`);

        return updatedTeam;
    }
}