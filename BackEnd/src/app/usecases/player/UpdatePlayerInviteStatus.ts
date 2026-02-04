import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUpdatePlayerInviteStatus } from "../../repositories/interfaces/player/ITeamRepositoryUsecase.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { INotificationRepository } from "../../repositories/interfaces/shared/INotificationRepository.js";
import { BadRequestError } from "../../../domain/errors/index.js";


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
