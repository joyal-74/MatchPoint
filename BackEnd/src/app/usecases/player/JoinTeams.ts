import { inject, injectable } from "tsyringe";
import { IJoinTeamUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { IPlayerRepository } from "../../repositories/interfaces/player/IPlayerRepository.js";
import { INotificationRepository } from "../../repositories/interfaces/shared/INotificationRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { TeamData } from "../../../domain/dtos/Team.dto.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class JoinTeamUseCase implements IJoinTeamUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, teamId: string): Promise<TeamData> {
        this._logger.info(`Player ${userId} attempting to join team ${teamId}`);

        const team = await this._teamRepo.findById(teamId);
        if (!team) throw new NotFoundError("Team not found");

        const player = await this._playerRepo.findByUserId(userId);
        if (!player) throw new NotFoundError('player not found')

        const playerName = `${player.userId?.firstName} ${player.userId?.lastName}`

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
            message: `${playerName} requested to join your team`,
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