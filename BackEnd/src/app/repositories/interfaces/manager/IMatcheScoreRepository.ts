import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { TournamentMatchStatsDocument } from "../../../../domain/types/match.types.js";

export interface IMatchScoreRepository {
    getMatch(matchId: string): Promise<MatchEntity | null>;
    createInitialMatch(matchId: string, oversLimit: number): Promise<TournamentMatchStatsDocument>;
    addExtras(matchId: string, type: string, runs: number) : Promise<TournamentMatchStatsDocument>;
    save(doc: TournamentMatchStatsDocument): Promise<void>;
}
