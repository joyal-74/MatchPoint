import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamDataFull } from "domain/dtos/Team.dto";
import { IGetAllTeamsUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";

@injectable()
export class GetAllTeamUseCase implements IGetAllTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(managerId : string): Promise<TeamDataFull[]> {
        this._logger.info(`Fetching teams.. for ${managerId}`);

        const allTeams = await this._teamRepo.findAll(managerId);

        this._logger.info(`Total ${allTeams.length} teams found for manager ${managerId}`);
        
        return TeamMapper.toTeamDTOs(allTeams);
    }
}