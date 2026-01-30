import type { playerJoinStatus } from "../../../features/player/playerTypes";

export type playerStatus = "playing" | "sub";

export interface Team {
    _id: string;
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    description: string;
    maxPlayers: number;
    members: Members[];
    membersCount: number;
    state: string;
    city: string;
    stats: {
        totalMatches: number;
        winRate: number;
    };
    phase: "recruiting" | "active" | "completed";
    createdAt: string;
    displayStatus?: string;
    isFull?: boolean;
}


export interface Members {
    _id : string;
    playerId: string;
    userId: string;
    firstName : string;
    lastName : string;
    profileImage : string;
    status: playerStatus;
    approvalStatus : playerJoinStatus;
    profile : Record<string, string | number | boolean | null>;
}

export interface Filters {
    sport?: string;
    state?: string;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}

export type totalTeamResponse = {
    pendingTeams : Team[];
    approvedTeams : Team[];
    totalApprovedTeams : number;
    totalPendingTeams : number;
}