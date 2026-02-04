import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IApprovePlayerUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository.js";
import { TeamDataFull } from "../../../../domain/dtos/Team.dto.js";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index.js";
import { TeamMapper } from "../../../mappers/TeamMappers.js";


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
