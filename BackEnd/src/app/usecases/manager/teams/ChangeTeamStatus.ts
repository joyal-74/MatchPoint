import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IChangeTeamStatusUseCase, } from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { BadRequestError } from "domain/errors";

export class SoftDeleteTeam implements IChangeTeamStatusUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger,
    ) { }

    async execute(teamId: string): Promise<string> {
        this._logger.info(`Deleting team initiated.. for ${teamId}`);

        const teamExist = await this._teamRepo.findById(teamId);

        if (!teamExist) throw new BadRequestError('No team exist with this teamId');

        const teamData = await this._teamRepo.update(teamId, { status: false })

        this._logger.info(`Successfully deleted team with Id :  ${teamId}`);

        return teamData._id;
    }
}