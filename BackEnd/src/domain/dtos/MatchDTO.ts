import type { TeamEntity as Team } from "domain/entities/Match";

export interface MatchResponseDTO {
    match: {
        _id: string;
        tournamentId: string;
        matchNumber: string;
        round: number;
        date: string;
        venue: string;
        status: string;
        winner: string | null;
        stats: Record<string, any>;
    };
    teamA: Team;
    teamB: Team;
}
