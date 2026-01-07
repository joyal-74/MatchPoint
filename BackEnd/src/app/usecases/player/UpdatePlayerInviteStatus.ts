import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { BadRequestError } from "domain/errors";
import { IUpdatePlayerInviteStatus } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";

@injectable()
export class UpdatePlayerInviteStatus implements IUpdatePlayerInviteStatus {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async execute({ playerId, teamId, status }) {
        const updated = await this._teamRepo.updateInviteStatus(
            teamId,
            playerId,
            status
        );


        if (!updated) {
            throw new BadRequestError("Invalid invite or team");
        }

        await this._notificationRepo.markInviteAsRead(playerId, teamId, status);

        return { message: `Invite ${status} successfully` };
    }
}