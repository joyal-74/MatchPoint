import { IPlayerTeamServices } from "app/services/player/IPlayerTeamServices";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { PlayerTeamResponseDTO } from "domain/dtos/Team.dto";

export class PlayerTeamServices implements IPlayerTeamServices {
    constructor(
        private _teamRepository: ITeamRepository,
    ) {}

    async findPlayerTeams(playerId: string): Promise<PlayerTeamResponseDTO> {

        const approveResult = await this._teamRepository.findAllWithUserId(playerId, "approved");

        const pendingResult = await this._teamRepository.findAllWithUserId(playerId, "pending");
        
        return {
            approvedTeams : approveResult.teams,
            totalApprovedTeams : approveResult.totalTeams,
            pendingTeams : pendingResult.teams,
            totalPendingTeams : pendingResult.totalTeams,
        };
    }
}