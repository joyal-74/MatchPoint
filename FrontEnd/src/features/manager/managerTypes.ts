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
    startDate: string | Date;
    endDate: string | Date;
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
    format: Formats;
    createdAt: Date,
    updatedAt: Date,
    banner: File | string | undefined;
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
    startDate: string | Date;
    endDate: string | Date;
    regDeadline: string | Date;
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

export type MatchStatus = "ongoing" | "completed" | "upcoming" | "bye";

export interface Match {
    _id?: string;
    tournamentId?: string;
    teamA: string;
    teamB: string | null;
    round: number;
    matchNumber: number;
    status: MatchStatus;
    venue?: string;
    date?: Date;
    winner: string;
    stats: Record<string, any>;
}

export type FixtureFormat = "knockout" | "league" | "friendly";

export interface FixtureMatch {
    matchId: string;
    round: number;
}

export interface Fixture {
    _id?: string;
    tournamentId: string;
    format: FixtureFormat;
    matches: FixtureMatch[];
    createdAt?: Date;
}