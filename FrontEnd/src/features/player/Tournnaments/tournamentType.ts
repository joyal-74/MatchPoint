export type Formats = 'knockout' | 'league' | 'friendly';

export type Status = "upcoming" | "ongoing" | "completed"

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

export interface PointsRow {
    rank: number;
    team: string;
    p: number;
    w: number;
    l: number;
    nrr: string;
    pts: number;
    form: string[];
}

export interface TopPerformer {
    player: string;
    team: string;
    value: string;
    subValue: string;
}

export interface TournamentStats {
    orangeCap: TopPerformer;
    purpleCap: TopPerformer;
    mvp: TopPerformer;
}