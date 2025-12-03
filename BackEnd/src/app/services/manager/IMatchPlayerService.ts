import { MatchResponseDTO } from "domain/dtos/MatchDTO";

export interface IMatchPlayerServices {
    getMatchDashboard(matchId: string): Promise<MatchResponseDTO>
}