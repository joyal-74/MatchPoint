import { inject, injectable } from "tsyringe";
import { IGetTeamDetails } from "../../repositories/interfaces/admin/IAdminUsecases";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { TeamDataFull } from "../../../domain/dtos/Team.dto";
import { NotFoundError } from "../../../domain/errors/index";
import { TeamMapper } from "../../mappers/TeamMappers";


@injectable()
export class GetTeamDetails implements IGetTeamDetails {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<TeamDataFull> {
        const team = await this._teamRepo.findById(playerId);

        if (!team) {
            this._logger.warn(`Team not found for ID: ${playerId}`);
            throw new NotFoundError("Manager not found");
        }

        const teamDetails = TeamMapper.toTeamDTO(team);
        this._logger.info(`Fetched details of team: ${team.name}`);

        return teamDetails;
    }
}
