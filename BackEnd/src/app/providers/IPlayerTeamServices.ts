import { PlayerTeamResponseDTO } from "domain/dtos/Team.dto";

export interface IPlayerTeamServices {
    findPlayerTeams(userId : string) : Promise<PlayerTeamResponseDTO>;
}