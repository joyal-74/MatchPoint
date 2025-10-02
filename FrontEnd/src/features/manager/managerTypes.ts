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


export type Formats = 'knockout' | 'league' | 'friendly';

export type Status = "upcoming" | "ongoing" | "ended"

export type Tournament = {
    _id: string;
    tourId: string;
    managerId: string;
    name: string;
    sport: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    maxTeams: number;
    minTeams: number;
    prizePool: number;
    entryFee: string;
    status: Status;
    format: Formats;
}


export type TournamentRegister = {
    managerId: string;
    name: string;
    sport: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    maxTeams: number;
    minTeams: number;
    prizePool: number;
    entryFee: string;
    format: Formats;
}