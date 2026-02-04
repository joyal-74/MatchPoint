import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IChangeTeamStatusUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository.js";
import { ILogger } from "../../../providers/ILogger.js";
import { BadRequestError } from "../../../../domain/errors/index.js";



@injectable()
export class ChangeTeamStatusUsecase implements IChangeTeamStatusUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(teamId: string): Promise<string> {
        this._logger.info(`Deleting team initiated.. for ${teamId}`);

        const teamExist = await this._teamRepo.findById(teamId);

        if (!teamExist) throw new BadRequestError('No team exist with this teamId');

        const teamData = await this._teamRepo.update(teamId, { status: "deleted" })

        this._logger.info(`Successfully deleted team with Id :  ${teamId}`);

        return teamData._id;
    }
}
