import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamDataFull } from "domain/dtos/Team.dto";
import { IGetAllTeamsUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";


export class GetAllTeamUseCase implements IGetAllTeamsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger,
    ) { }

    async execute(managerId : string): Promise<TeamDataFull[]> {
        this._logger.info(`Fetching teams.. for ${managerId}`);

        const allTeams = await this._teamRepo.findAll(managerId);

        this._logger.info(`Total ${allTeams.length} teams found for manager ${managerId}`);
        
        return TeamMapper.toTeamDTOs(allTeams);
    }
}