import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetMyTeamDetailsUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { TeamDataFull } from "../../../domain/dtos/Team.dto";
import { NotFoundError } from "../../../domain/errors/index";
import { TeamMapper } from "../../mappers/TeamMappers";


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
