import type { Match } from "domain/entities/Match";
import { MatchEntity } from "domain/entities/MatchEntity";

export interface MatchStreamData {
    streamTitle: string;
    streamDescription: string;
    isStreamLive: boolean;
    streamStartedAt?: Date;
    streamerId?: string;
    managerId?: string;
}


export interface IMatchesRepository {
    createMatches(tournamentId: string, matches: Match[]): Promise<Match[]>;
    updateMatchStats(matchId: string, stats: Record<string, any>): Promise<Match>;
    getMatchesByTournament(tournamentId: string): Promise<Match[]>;
    getMatchById(matchId: string): Promise<Match | null>;
    getMatchDetails(matchId: string): Promise<MatchEntity | null>;
    getStreamMetadata(matchId: string,): Promise<MatchStreamData>;
    updateStreamMetadata(matchId: string, data: MatchStreamData): Promise<void>;
    updateStreamStatus(matchId: string, isLive: boolean): Promise<void>;
    updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity | null>;
}