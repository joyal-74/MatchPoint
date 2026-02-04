import { PlayerTeamResponseDTO } from "../../../domain/dtos/Team.dto.js";

export interface IPlayerTeamServices {
    findPlayerTeams(userId : string) : Promise<PlayerTeamResponseDTO>;
}
