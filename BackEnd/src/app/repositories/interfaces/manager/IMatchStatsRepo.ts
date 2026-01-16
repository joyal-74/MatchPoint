import { LiveMatchCardDTO } from "domain/dtos/LiveMatchDTO";
import { MatchEntity } from "domain/entities/MatchEntity";

export interface LiveMatchQuery {
    limit?: number;
    page?: number; 
    tournamentId?: string;
}

export interface IMatchStatsRepo {
    findByMatchId(matchId: string): Promise<MatchEntity | null>;
    updateStatus(matchId: string, status : string): Promise<boolean>;
    findLiveMatches(query: LiveMatchQuery): Promise<LiveMatchCardDTO[]>;
    save(match: MatchEntity): Promise<MatchEntity>;
}