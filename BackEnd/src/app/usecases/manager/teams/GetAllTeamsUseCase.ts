import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IGetAllTeamsUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../../providers/ILogger";
import { TeamDataFull } from "../../../../domain/dtos/Team.dto";
import { TeamMapper } from "../../../mappers/TeamMappers";


@injectable()
export class GetAllTeamUseCase implements IGetAllTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(managerId : string): Promise<TeamDataFull[]> {
        this._logger.info(`Fetching teams.. for ${managerId}`);

        const allTeams = await this._teamRepo.findAllByManager(managerId);

        this._logger.info(`Total ${allTeams.length} teams found for manager ${managerId}`);
        
        return TeamMapper.toTeamDTOs(allTeams);
    }
}
