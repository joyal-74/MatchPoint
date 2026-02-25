import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

import { IPlayerTeamServices } from "../../app/services/player/IPlayerTeamServices";
import { ITeamRepository } from "../../app/repositories/interfaces/shared/ITeamRepository";
import { PlayerTeamResponseDTO } from "../../domain/dtos/Team.dto";

@injectable()
export class PlayerTeamServices implements IPlayerTeamServices {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepository: ITeamRepository,
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
