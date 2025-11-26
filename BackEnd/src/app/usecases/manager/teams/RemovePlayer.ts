import { TeamMapper } from "app/mappers/TeamMappers";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IRemovePlayerUseCase } from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { TeamDataFull } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";

export class RemovePlayerUseCase implements IRemovePlayerUseCase {
    constructor(
        private _teamRepo: ITeamRepository
    ) { }

    async execute(teamId: string, playerId: string): Promise<TeamDataFull> {

        if (!playerId || !teamId) {
            throw new BadRequestError("playerId and teamId are required");
        }

        const updatedTeam = await this._teamRepo.removePlayer(teamId, playerId);

        if (!updatedTeam) {
            throw new NotFoundError("Team or player not found");
        }

        return TeamMapper.toTeamDTO(updatedTeam);
    }
}