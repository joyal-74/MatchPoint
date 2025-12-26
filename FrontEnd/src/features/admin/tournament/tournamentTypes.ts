export type TeamStatus = 'active' | 'blocked' | 'deleted';
export type Status = "upcoming" | "ongoing" | "ended"

export interface Team {
    _id: string;
    teamId: string;
    managerId: string;
    name: string;
    sport: string;
    maxPlayers: string;
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


export interface Tournament {
    _id: string;
    tourId: string;
    managerId: string;
    title: string;
    description: string;
    sport: string;
    startDate: string;
    endDate: string;
    regDeadline: string | Date;
    location: string;
    latitude: number;
    longitude: number;
    maxTeams: number;
    minTeams: number;
    currTeams: number;
    entryFee: string;
    prizePool: number;
    playersPerTeam: number;
    status: Status;
    isBlocked : boolean;
    createdAt: Date,
    updatedAt: Date,
    banner: File | string | undefined;
}