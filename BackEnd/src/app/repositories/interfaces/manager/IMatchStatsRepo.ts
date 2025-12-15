import { MatchEntity } from "domain/entities/MatchEntity";

export interface IMatchRepo {
    findByMatchId(matchId: string): Promise<MatchEntity | null>;
    findLiveMatches(): Promise<MatchEntity[] | null>;
    save(match: MatchEntity): Promise<MatchEntity>;
}