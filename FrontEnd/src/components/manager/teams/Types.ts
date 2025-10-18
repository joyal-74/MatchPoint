export type TeamStatus = 'active' | 'blocked' | 'deleted'
export type playerStatus = "playing" | "substitute";


export interface Team {
    _id: string;
    managerId: string;
    name: string;
    sport: string;
    maxPlayers: string;
    members: Members[];
    membersCount: number;
    state: string;
    city: string;
    createdAt: string;
    status: TeamStatus;
    logo: string;
    description?: string;
}

export interface Members {
    _id : string;
    playerId: string;
    userId: string;
    firstName : string;
    lastName : string;
    profile : Record <string, string | number>
    status: playerStatus;
    profileImage : string;
}