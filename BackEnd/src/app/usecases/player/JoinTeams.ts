import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IJoinTeamUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamData } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";
import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";

export class JoinTeamUseCase implements IJoinTeamUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _playerRepo: IPlayerRepository,
        private _notificationRepo: INotificationRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string, teamId: string): Promise<TeamData> {
        this._logger.info(`Player ${userId} attempting to join team ${teamId}`);

        const team = await this._teamRepo.findById(teamId);
        if (!team) throw new NotFoundError("Team not found");

        const player = await this._playerRepo.findByUserId(userId);
        if (!player) throw new NotFoundError('player not found')

        const alreadyMember = team.members.some(m => {
            return m.userId === userId;
        });

        if (alreadyMember) throw new BadRequestError("Player already in this team");

        if (team.members.length >= team.maxPlayers)
            throw new BadRequestError("Team is full");

        const updatedTeam = await this._teamRepo.addMember(teamId, userId, player?._id);

        await this._notificationRepo.create({
            userId: team.managerId,
            type: "TEAM_JOIN_REQUEST",
            title: "New Join Request",
            message: `${player.userId} requested to join your team`,
            meta: {
                teamId,
                playerId: player._id,
                requestType: "join",
                inviteStatus: "pending"
            }
        });

        this._logger.info(`Join request notification sent to manager`);

        return updatedTeam;
    }
}