export type TeamStatus = 'active' | 'blocked' | 'deleted';
export type playerStatus = "playing" | "substitute";


export interface Team {
    _id: string;
    managerId: string;
    name: string;
    sport: string;
    maxPlayers: string;
    members: PlayerDetails[];
    membersCount: number;
    state: string;
    city: string;
    createdAt: string;
    status: TeamStatus;
    logo: string;
    description?: string;
    phase: string;
    stats: Record<string, string | number>;
}

export interface Members {
    _id: string;
    playerId: string;
    userId: string;
    firstName: string;
    lastName: string;
    profile: Record<string, string | number>
    status: playerStatus;
    profileImage: string;
    approvalStatus: 'approved' | 'pending';
}

export type PlayerDetails = CricketPlayer

interface BasePlayer {
    _id: string;
    userId: string;
    playerId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
    profileImage: string;
    status: playerStatus;
    approvalStatus: 'approved' | 'pending' | 'rejected';
}

interface CricketPlayer extends BasePlayer {
    sport: 'Cricket';
    profile: {
        battingStyle?: string;
        bowlingStyle?: string;
        position?: string;
        jerseyNumber?: string;
    };
    stats?: {
        batting?: { matches?: number; runs?: number; average?: number; strikeRate?: number };
        bowling?: { matches?: number; wickets?: number; economy?: number; average?: number };
    };
}