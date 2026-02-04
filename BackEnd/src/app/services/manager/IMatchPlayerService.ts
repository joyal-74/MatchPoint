import { MatchResponseDTO } from "../../../domain/dtos/MatchDTO.js" 

export interface IMatchPlayerServices {
    getMatchDashboard(matchId: string): Promise<MatchResponseDTO>
}
