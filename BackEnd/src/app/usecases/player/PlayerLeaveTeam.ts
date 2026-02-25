import { inject, injectable } from "tsyringe";
import { IPlayerLeaveTeamUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";


@injectable()
export class PlayerLeaveTeamUseCase implements IPlayerLeaveTeamUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, teamId: string): Promise<string> {

        this._logger.info(`Processing leave request: Player[${userId}] Team[${teamId}]`);

        const isRemoved = await this._teamRepo.leavePlayer(teamId, userId);

        if (!isRemoved) {
            this._logger.warn(`Removal failed: Player[${userId}] was not part of Team[${teamId}]`);
            throw new Error("Could not process request: You are not a member of this team.");
        }

        this._logger.info(`Successful leave: Player[${userId}] left Team[${teamId}]`);

        return teamId;
    }
}
