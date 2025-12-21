import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { INotificationRepository } from "app/repositories/interfaces/shared/INotificationRepository";
import { BadRequestError } from "domain/errors";
import { IUpdatePlayerInviteStatus } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";

export class UpdatePlayerInviteStatus implements IUpdatePlayerInviteStatus {

    constructor(
        private _teamRepo: ITeamRepository,
        private _notificationRepo: INotificationRepository
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