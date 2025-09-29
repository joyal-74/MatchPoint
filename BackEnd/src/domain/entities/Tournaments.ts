export interface Tournament {
    id: string;
    managerId : string;
    name: string;
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