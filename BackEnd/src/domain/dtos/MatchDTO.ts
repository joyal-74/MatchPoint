import type { TeamEntity as Team } from "../../domain/entities/Match";
import { PlayerEntity } from "../..//domain/entities/Player";

export interface DashboardPlayer extends PlayerEntity {
    status: string;
}

export interface DashboardTeam extends Omit<Team, 'members'> {
    members: DashboardPlayer[];
}

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
    teamA: DashboardTeam;
    teamB: DashboardTeam;
}
