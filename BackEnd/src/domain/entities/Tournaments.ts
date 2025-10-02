export type Status = "upcoming" | "ongoing" | "ended"
export type Format = 'knockout' | 'league' | 'friendly';


export interface Tournament {
    _id : string;
    tourId: string;
    managerId: string;
    name: string;
    sport: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maxTeams: number;
    minTeams: number;
    prizePool: number;
    entryFee: string;
    status: Status;
    format: Format;
    isDeleted : boolean;
    teams?: { teamId: string }[];
}

export interface TournamentRegister {
    tourId: string;
    managerId: string;
    name: string;
    sport: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maxTeams: number;
    minTeams: number;
    prizePool: number;
    entryFee: string;
}