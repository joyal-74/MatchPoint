import { MatchEntity } from "domain/entities/MatchEntity";

export interface IMatchStatsRepo {
    findByMatchId(matchId: string): Promise<MatchEntity | null>;
    updateStatus(matchId: string, status : string): Promise<boolean>;
    findLiveMatches(): Promise<MatchEntity[] | null>;
    save(match: MatchEntity): Promise<MatchEntity>;
}