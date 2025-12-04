import { TournamentMatchStatsDocument } from "infra/databases/mongo/models/TournamentMatchStatsModel";

export interface IMatchScoreRepository {
    getMatch(matchId: string): Promise<TournamentMatchStatsDocument | null>;
    createInitialMatch(matchId: string): Promise<TournamentMatchStatsDocument>;
    save(doc: TournamentMatchStatsDocument): Promise<void>;
}