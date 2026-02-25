import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IApprovePlayerUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository";
import { TeamDataFull } from "../../../../domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index";
import { TeamMapper } from "../../../mappers/TeamMappers";


@injectable()
export class ApprovePlayerUseCase implements IApprovePlayerUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository
    ) { }

    async execute(teamId: string, playerId: string): Promise<TeamDataFull> {
        if (!playerId || !teamId) {
            throw new BadRequestError("playerId and teamId are required");
        }

        const updatedTeam = await this._teamRepo.playerTeamStatus(teamId, playerId, 'approved');

        if (!updatedTeam) {
            throw new NotFoundError("Team or player not found");
        }

        return TeamMapper.toTeamDTO(updatedTeam);
    }
}
