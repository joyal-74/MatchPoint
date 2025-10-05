export type TeamStatus = 'active' | 'blocked' | 'deleted'
export type playerStatus = "playing" | "sub";
export type PlayerApprovalStatus = "pending" | "approved" | "rejected";
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
    status: playerStatus;
    approvalStatus: PlayerApprovalStatus;
}

export interface TeamRegister {
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    state: string;
    city: string;
    description: string;
    maxPlayers: number;
    members: TeamMember[];
    status: TeamStatus,
    phase: TeamPhase
    stats: statsType
}

export interface TeamData extends TeamRegister {
    _id: string;
    created: Date,
}

export interface Filters {
    sport?: string;
    state?: string;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}