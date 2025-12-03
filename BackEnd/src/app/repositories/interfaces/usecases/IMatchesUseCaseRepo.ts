import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { MatchEntity } from "domain/entities/Match";

export interface IGetMatchDetails {
    execute(matchId: string): Promise<MatchResponseDTO>
}

export interface ISaveMatchData {
    execute(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity>
}
