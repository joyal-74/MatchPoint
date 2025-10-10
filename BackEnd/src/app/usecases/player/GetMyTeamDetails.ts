import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IGetMyTeamDetailsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamDataFull } from "domain/dtos/Team.dto";
import { NotFoundError } from "domain/errors";

export class GetMyTeamDetails implements IGetMyTeamDetailsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(teamId: string): Promise<TeamDataFull> {
        this._logger.info(`Fetching teams with Id: ${teamId}`);

        const team = await this._teamRepo.findById(teamId);

        if(!team) throw new NotFoundError('Team not found');

        this._logger.info(`Fetched ${team._id} team`);

        return TeamMapper.toTeamDTO(team);
    }
}