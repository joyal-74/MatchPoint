import type { playerStatus } from "../../components/manager/teams/Types";

type profileType =  {
    position : string
}

export interface Members {
    playerId: string;
    userId: string;
    firstName: string;
    lastName: string;
    logo: string;
    profile: profileType;
    email: string;
    phone: string;
    isCaptain: boolean;
    status: playerStatus;
}


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
    created: string;
}


export interface Filters {
    sport?: string;
    state?: string;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}

export type playerJoinStatus = 'pending' | 'approved';

export interface Match {
    matchNumber: number;
    _id: string;
    teamA: {
        logo : string;
        name : string;
    };
    teamB: {
        logo : string;
        name : string;
    };
    round: number;
    oversA: string;
    oversB: string;
    scoreA: string;
    scoreB: string;
    status: "ongoing" | "completed" | "upcoming" | "bye";
    winner: string | null;
    venue?: string;
    tossDecision?: string;
    tossWinner?: string;
    date?: Date;
    stats: Record<string, unknown>;
}