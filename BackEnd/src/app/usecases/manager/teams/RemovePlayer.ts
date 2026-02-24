import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IRemovePlayerUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository.js";
import { TeamDataFull } from "../../../../domain/dtos/Team.dto.js";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index.js";
import { TeamMapper } from "../../../mappers/TeamMappers.js";
import { SocketServer } from "../../../../presentation/socket/SocketServer.js";


@injectable()
export class RemovePlayerUseCase implements IRemovePlayerUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(SocketServer) private _socketServer: SocketServer
    ) { }

    async execute(teamId: string, playerId: string): Promise<TeamDataFull> {

        if (!playerId || !teamId) {
            throw new BadRequestError("playerId and teamId are required");
        }

        const team = await this._teamRepo.findById(teamId);
        if (!team) throw new NotFoundError("Team not found");

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) throw new NotFoundError("Player not found in this team");

        const userIdToKick = member.userId.toString();

        const updatedTeam = await this._teamRepo.removePlayer(teamId, playerId);

        this._socketServer.kickUserFromTeam(userIdToKick, teamId);

        if (!updatedTeam) {
            throw new NotFoundError("Team or player not found");
        }

        return TeamMapper.toTeamDTO(updatedTeam);
    }
}
