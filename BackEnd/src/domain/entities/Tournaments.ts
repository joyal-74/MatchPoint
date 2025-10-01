export type Formats = {
    Knockout: 'knockout',
    League: 'league',
    Friendly: 'friendly',
}

export type Status = "upcoming" | "ongoing" | "ended"

export interface Tournament {
    _id : string;
    tourId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maxTeams: number;
    prizePool: number;
    entry_fee: string;
    status: Status;
    format: Formats;
    price_pool: number;
    isDeleted : boolean;
    date: string;
    venue: string;
}

export interface TournamentRegister {
    tourId: string;
    name: string;
    date: string;
    venue: string;
}