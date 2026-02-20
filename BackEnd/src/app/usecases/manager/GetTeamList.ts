import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetAllTeamsUseCase } from "../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { TeamDataFull } from "../../../domain/dtos/Team.dto.js";


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