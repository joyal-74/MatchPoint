export type MatchStatus = "ongoing" | "completed" | "upcoming" | "bye";


export interface Match {
    _id?: string;
    matchId : string;
    tournamentId?: string;
    type : string;
    teamA: string;
    teamB: string | null;
    teamLogoA?: string;
    teamLogoB?: string;
    round: number;
    runs: number;
    wickets: number;
    matchNumber: number;
    status: MatchStatus;
    venue: string;
    date?: Date;
    winner: string;
}