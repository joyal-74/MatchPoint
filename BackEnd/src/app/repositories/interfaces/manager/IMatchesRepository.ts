import type { Match, MatchEntity } from "domain/entities/Match";

export interface IMatchesRepository {
    createMatches(tournamentId: string, matches: Match[]): Promise<Match[]>;
    updateMatchStats(matchId: string, stats: Record<string, any>): Promise<Match>;
    getMatchesByTournament(tournamentId: string): Promise<Match[]>;
    getMatchById(matchId: string): Promise<Match | null>;
    getMatchDetails(matchId: string): Promise<MatchEntity | null>;
    updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity | null>;
}