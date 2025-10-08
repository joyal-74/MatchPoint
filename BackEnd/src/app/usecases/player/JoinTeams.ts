import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IJoinTeamUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamData } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";

export class JoinTeamUseCase implements IJoinTeamUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _playerRepo: IPlayerRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string, teamId: string): Promise<TeamData> {
        this._logger.info(`Player ${userId} attempting to join team ${teamId}`);

        const team = await this._teamRepo.findById(teamId);
        if (!team) throw new NotFoundError("Team not found");

        const player = await this._playerRepo.findByUserId(userId);
        if (!player) throw new NotFoundError('player not found')

        const alreadyMember = team.members.some(m => {
            return m.playerId = player._id ;
        });

        if (alreadyMember) throw new BadRequestError("Player already in this team");

        if (team.members.length >= team.maxPlayers)
            throw new BadRequestError("Team is full");

        const updatedTeam = await this._teamRepo.addMember(teamId, userId, player?._id);
        this._logger.info(`Player ${userId} successfully joined team ${teamId}`);

        return updatedTeam;
    }
}