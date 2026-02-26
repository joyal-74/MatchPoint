import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetAllTeamsUseCase } from "../../repositories/interfaces/usecases/ITeamUsecaseRepository";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { TeamDataFull } from "../../../domain/dtos/Team.dto";


@injectable()
export class GetAllTeamsUseCase implements IGetAllTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(managerId: string): Promise<TeamDataFull[]> {
        this._logger.info(`Finding all teams for manager ${managerId}`);

        const teams = await this._teamRepo.findAllByManager(managerId);

        this._logger.info(`Total ${teams.length} teams found`);
        return teams;
    }
}
