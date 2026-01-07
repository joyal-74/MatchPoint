import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IAddPlayerToTeamUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

@injectable()
export class AddPlayerToTeamUseCase implements IAddPlayerToTeamUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository,
    ) { }

    async execute(teamId: string, userId: string, playerId: string): Promise<{ success: boolean; message: string }> {

        if (!userId) throw new NotFoundError('UserId not found')

        const result = await this._teamRepo.existOrAddMember(teamId, userId, playerId);
        console.log(result, " reult")

        if (!result.success) {
            throw new BadRequestError("Player already exists in team or team not found");
        }

        await this._notificationRepo.create({
            userId: userId,
            type: "TEAM_INVITE",
            title: "Team Invitation",
            message: "You have been invited to join a team",
            meta: {
                teamId,
                requestType: "invite",
                inviteStatus: "pending"
            }
        });

        return {
            success: true,
            message: "Invite request submitted successfully"
        };
    }
}
