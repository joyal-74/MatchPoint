export type Formats = {
    Knockout : 'knockout',
    League : 'league',
    Friendly : 'friendly',
}


export interface Tournament {
    id: string;
    managerId : string;
    name: string;
    logo: string;
    sport : string;
    description : string;
    start_date : Date;
    registration_end : Date;
    location : string;
    max_teams : number;
    entry_fee : string;
    format : Formats;
    price_pool : number;
    date: string;
    venue: string;
}

export interface ITournamentsResponse {
    myTournaments: Tournament[];
    exploreTournaments: Tournament[];
}


export interface TournamentRegister {
    id: string;
    name: string;
    date: string;
    venue: string;
}