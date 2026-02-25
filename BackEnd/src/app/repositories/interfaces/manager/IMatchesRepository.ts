import { MatchResponseDTO } from "../../../../domain/dtos/MatchDTO.js";
import type { Match } from "../../../../domain/entities/Match.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { AllMatchQuery } from "./IMatchStatsRepo.js";

export interface MatchStreamData {
    streamTitle: string;
    streamDescription: string;
    isStreamLive: boolean;
    streamStartedAt?: Date;
    streamerId?: string;
    managerId?: string;
}

export interface EndMatchDTO {
    status?: string;
    type?: string;
    reason: string;
    notes?: string;
    endedBy: string | null;

    winner?: string | null;
    resultType?: string | null;
    winMargin?: string | null;
    winType?: string | null;
    resultDescription?: string;

    endInfo?: {
        type: string | null;
        reason: string;
        notes?: string;
        endedBy: string | null;
        endedAt: Date;
    };
}


export interface IMatchesRepository {
    createMatches(tournamentId: string, matches: Match[]): Promise<Match[]>;
    updateMatchStats(matchId: string, stats: Record<string, string | number>): Promise<Match>;
    updateStatus(matchId: string, status: string): Promise<void>;
    getMatchesByTournament(tournamentId: string): Promise<Match[]>;
    getMatchesFilters(filters: { status?: string; page?: number; limit?: number }): Promise<{ matches: Match[], total: number }>;
    getMatchById(matchId: string): Promise<Match | null>;
    findAllMatches(query: AllMatchQuery): Promise<{ matches: Match[], totalPages: number }>;
    getUmpireMatches(umpireId: string): Promise<Match[] | null>;
    getMatchDetails(matchId: string): Promise<MatchResponseDTO | null>;
    getStreamMetadata(matchId: string,): Promise<MatchStreamData>;
    updateStreamMetadata(matchId: string, data: MatchStreamData): Promise<void>;
    updateStreamStatus(matchId: string, isLive: boolean): Promise<void>;
    endMatch(matchId: string, data: EndMatchDTO): Promise<MatchEntity>;
    updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity | null>;
}
