import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetMyTeamDetailsUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { TeamDataFull } from "../../../domain/dtos/Team.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { TeamMapper } from "../../mappers/TeamMappers.js";


@injectable()
export class GetMyTeamDetails implements IGetMyTeamDetailsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(teamId: string): Promise<TeamDataFull> {
        this._logger.info(`Fetching teams with Id: ${teamId}`);

        const team = await this._teamRepo.findById(teamId);

        if(!team) throw new NotFoundError('Team not found');

        this._logger.info(`Fetched ${team._id} team`);

        return TeamMapper.toTeamDTO(team);
    }
}
