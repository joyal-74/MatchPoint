import { paymentStatus } from "./Payment";

export type Status = "upcoming" | "ongoing" | "ended" | "cancelled"
export type Format = 'knockout' | 'league' | 'friendly';

export type Contact = {
    email: string;
    phone: string;
}

export interface TournamentTeam {
    teamId: string;
    teamName: string;
    logo: string;
    captainId: string;
    managerId: string;
    paymentStatus: paymentStatus;
    paymentId?: string | null;
}


export interface Tournament {
    _id: string;
    tourId: string;
    managerId: string;
    title: string;
    description: string;
    sport: string;
    startDate: Date;
    endDate: Date;
    regDeadline: Date;
    location: string;
    latitude?: number;
    longitude?: number;
    maxTeams: number;
    minTeams: number;
    currTeams: number;
    entryFee: string;
    prizePool: number;
    playersPerTeam: number;
    status: Status;
    format: Format;
    organizer: string;
    contact: Contact;
    rules: string[];
    isDeleted : boolean;
}

export interface TournamentRegister {
    tourId: string;
    managerId: string;
    title: string;
    sport: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maxTeams: number;
    minTeams: number;
    prizePool: number;
    playersPerTeam: number;
    entryFee: string;
    format: Format;
}