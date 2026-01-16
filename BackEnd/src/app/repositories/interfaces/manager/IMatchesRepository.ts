import { MatchResponseDTO } from "domain/dtos/MatchDTO";
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

export interface EndMatchData {
    type: "NORMAL" | "ABANDONED" | "NO_RESULT";
    reason?: "RAIN" | "BAD_LIGHT" | "FORCE_END" | "OTHER";
    notes?: string;
    endedBy: string | null;
}


export interface IMatchesRepository {
    createMatches(tournamentId: string, matches: Match[]): Promise<Match[]>;
    updateMatchStats(matchId: string, stats: Record<string, string | number>): Promise<Match>;
    updateStatus(matchId: string, status: string): Promise<void>;
    getMatchesByTournament(tournamentId: string): Promise<Match[]>;
    getMatchesFilters(filters: { status?: string; page?: number; limit?: number }): Promise<{matches : Match[], total : number}>;
    getMatchById(matchId: string): Promise<Match | null>;
    getMatchDetails(matchId: string): Promise<MatchResponseDTO | null>;
    getStreamMetadata(matchId: string,): Promise<MatchStreamData>;
    updateStreamMetadata(matchId: string, data: MatchStreamData): Promise<void>;
    updateStreamStatus(matchId: string, isLive: boolean): Promise<void>;
    endMatch(matchId: string, data: EndMatchData): Promise<MatchEntity>;
    updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity | null>;
}