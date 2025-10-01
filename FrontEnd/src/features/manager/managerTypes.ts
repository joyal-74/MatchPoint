export type TeamStatus = 'active' | 'blocked' | 'deleted'
export type playerStatus = "playing" | "sub";


export interface Team {
    _id: string;
    managerId: string;
    name: string;
    sport: string;
    maxPlayers: string;
    members: Members[];
    created: string;
    status: TeamStatus;
    logo: string;
    description?: string;
}

export interface Members {
    playerId: string;
    status: playerStatus;
}

export interface EditTeamPayload {
    teamId: string;
    updatedData: EditTeamData;
}

export type CreateTeamData = {
    name: string;
    sport: string;
    maxPlayers: number;
    managerId: string;
    logo: File;
    description?: string;
};

export type EditTeamData = {
    name: string;
    sport: string;
    status: TeamStatus;
    managerId: string;
    members: Members[];
    description?: string;
    logo?: string;
    maxPlayers?: string;
};

export type TeamData = Omit<Team, "_id">;