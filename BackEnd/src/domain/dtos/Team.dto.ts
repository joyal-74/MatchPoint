import { PlayerProfileType } from "./Sports.dto";

export type TeamStatus = 'active' | 'blocked' | 'deleted'
export type playerStatus = "playing" | "substitute";
export type PlayerApprovalStatus = "pending" | "approved" | "rejected";
export type requestType = "join" | "invite";
export type TeamPhase = "recruiting" | "active" | "competing" | "completed" | "inactive";
export type statsType = {
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
}

export interface TeamMember {
    playerId: string;
    userId: string;
    status: playerStatus;
    approvalStatus: PlayerApprovalStatus;
}


export interface MapMember {
    playerId: {
        _id: string;
        profile: PlayerProfileType;
        stats: statsType;
    };
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profileImage: string;
    };
    status: playerStatus;
    approvalStatus: PlayerApprovalStatus;
}

// For team list
export interface TeamDataSummary {
    _id: string;
    teamId: string;
    managerId: string;
    managerName: string;
    name: string;
    logo: string;
    sport: string;
    state: string
    city: string
    description: string;
    membersCount: number;
    maxPlayers: number;
    status: TeamStatus;
    phase: TeamPhase;
    stats: statsType;
    createdAt: Date;
    isBlocked: boolean;
}

// For full team details
export interface TeamDataFull extends TeamDataSummary {
    logo: string;
    state: string;
    city: string;
    description: string;
    members: TeamMember[];
}


export interface TeamRegister {
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    state: string;
    isBlocked: boolean;
    city: string;
    description: string;
    maxPlayers: number;
    members: TeamMember[];
    status: TeamStatus,
    phase: TeamPhase,
    stats: statsType
}

export interface TeamData extends TeamRegister {
    _id: string;
    createdAt: Date,
}

export interface Filters {
    sport?: string;
    state?: string;
    search?: string;
    page?: number;
    limit?: number;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}

export interface AdminFilters {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}

export interface PlayerTeamResponseDTO {
    approvedTeams: TeamDataSummary[];
    pendingTeams: TeamDataSummary[];
    totalApprovedTeams: number;
    totalPendingTeams: number;
}