import { TournamentMatchStatsDocument } from "infra/databases/mongo/models/TournamentMatchStatsModel";

export interface IMatchScoreService {
    initInnings(matchId: string): Promise<TournamentMatchStatsDocument | null>;
    setStriker(matchId: string, batsmanId: string): Promise<TournamentMatchStatsDocument | null>;
    setNonStriker(matchId: string, batsmanId: string): Promise<TournamentMatchStatsDocument | null>;
    setBowler(matchId: string, bowlerId: string): Promise<TournamentMatchStatsDocument | null>;
    addRuns(matchId: string, runs: number): Promise<TournamentMatchStatsDocument | null>;
    addWicket(matchId: string, dismissalType: string, nextBatsmanId: string): Promise<TournamentMatchStatsDocument | null>;
}
