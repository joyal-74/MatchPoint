import type { Match } from "domain/entities/Match";

export interface IMatchesRepository {
    createMatches(tournamentId: string, matches: Match[]): Promise<Match[]>;
    updateMatchStats(matchId: string, stats: Record<string, any>): Promise<Match>;
    getMatchesByTournament(tournamentId: string): Promise<Match[]>;
    getMatchById(matchId: string): Promise<Match | null>;
}