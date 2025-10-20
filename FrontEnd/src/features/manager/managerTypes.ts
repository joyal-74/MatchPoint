import type { Team, TeamStatus } from "../../components/manager/teams/Types";

export interface EditTeamPayload {
    teamId: string;
    updatedData: EditTeamData;
}

export interface UpdateUserDataPayload {
    userData: FormData;
    userId: string;
}

export interface UpdatePlayerProfilePayload {
    userData: {
        sport: string;
        [key: string]: string;
    };
    userId: string;
}

export type CreateTeamData = {
    name: string;
    sport: string;
    maxPlayers: number;
    managerId: string;
    state: string;
    city: string;
    logo: File;
    description?: string;
};

export type EditTeamData = {
    name: string;
    sport: string;
    status: TeamStatus;
    managerId: string;
    state: string;
    city: string;
    membersCount: number;
    description?: string;
    logo?: string;
    maxPlayers?: string;
};

export type TeamData = Omit<Team, "_id">;


export type Formats = 'knockout' | 'league' | 'friendly';

export type Status = "upcoming" | "ongoing" | "ended"

export type Contact = { email: string; phone: string; }

export interface TournamentCard {
    _id: string;
    tourId: string;
    managerId: string;
    title: string;
    description: string;
    sport: string;
    startDate: string;
    endDate: string;
    regDeadline: string;
    location: string;
    maxTeams: number;
    minTeams: number;
    currTeams: number;
    entryFee: string;
    prizePool: number;
    status: Status;
    format: Formats;
    createdAt: Date,
    updatedAt: Date,
}

export interface Tournament extends TournamentCard {
    organizer: string;
    contact: Contact;
    teams?: { teamId: string }[];
    rules: string[];
}


export type TournamentRegister = {
    managerId: string;
    title: string;
    sport: string;
    description: string;
    startDate: string;
    endDate: string;
    regDeadline: string;
    location: string;
    maxTeams: number;
    minTeams: number;
    currTeams: number;
    prizePool: number;
    entryFee: string;
    format: Formats;
    rules: string[];
}

export type TournamentUpdate = TournamentRegister & { _id: string }

export interface PaymentUrls {
    success: string;
    cancel: string;
}


export type FixtureFormat = 'knockout' | 'league' | 'friendly';
export type MatchStatus = 'ongoing' | 'completed' | 'upcoming' | "bye";

export interface Match {
    matchNumber: number;
    teamA: string;
    teamB: string | null;
    round?: number;
    date?: Date;
    status: MatchStatus;
    result?: {
        teamAScore: number;
        teamBScore: number;
    };
    winner: string;
}



export interface Fixture {
    _id?: string;
    tournamentId: string;
    format: FixtureFormat;
    matches: Match[];
    createdAt?: Date;
}