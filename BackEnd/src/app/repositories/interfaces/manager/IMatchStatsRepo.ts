import { LiveMatchCardDTO } from "domain/dtos/LiveMatchDTO";
import { TournamentResult } from "domain/entities/Match";
import { MatchEntity } from "domain/entities/MatchEntity";
import { TournamentMatchStatsDocument } from "domain/types/match.types";

export interface LiveMatchQuery {
    limit?: number;
    page?: number; 
    tournamentId?: string;
}

export interface AllMatchQuery {
    limit?: number;
    page?: number; 
    search?: string;
}

export interface IMatchStatsRepo {
    findByMatchId(matchId: string): Promise<MatchEntity | null>;
    updateStatus(matchId: string, status : string): Promise<boolean>;
    findLiveMatches(query: LiveMatchQuery): Promise<LiveMatchCardDTO[]>;
    findAllMatches(query: AllMatchQuery): Promise<{ matches: MatchEntity[], totalPages: number }>;
    getCompletedMatches(tournamentId : string) : Promise<TournamentResult[]>;
    findFullLiveMatches(query: LiveMatchQuery): Promise<TournamentMatchStatsDocument[]>;
    save(match: MatchEntity): Promise<MatchEntity>;
    getMatchStats(matchId: string): Promise<TournamentMatchStatsDocument | null>;
}