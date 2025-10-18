import { IPlayerTeamServices } from "app/providers/IPlayerTeamServices";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { PlayerTeamResponseDTO } from "domain/dtos/Team.dto";

export class PlayerTeamServices implements IPlayerTeamServices {
    constructor(
        private _teamRepository: ITeamRepository,
    ) {}

    async findPlayerTeams(playerId: string): Promise<PlayerTeamResponseDTO> {

        const approveResult = await this._teamRepository.findAllWithUserId(playerId, "approved");

        const pendingResult = await this._teamRepository.findAllWithUserId(playerId, "pending");

        console.log('....', approveResult)
        console.log('//////', pendingResult)

        return {
            approvedTeams : approveResult.teams,
            totalApprovedTeams : approveResult.totalTeams,
            pendingTeams : pendingResult.teams,
            totalPendingTeams : pendingResult.totalTeams,
        };
    }
}