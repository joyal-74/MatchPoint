import { Leaderboard, PointsRow, Tournament } from "domain/entities/Tournaments";

export interface ITournamentDetails {
    execute(id: string): Promise<Tournament>;
}

export interface IGetTournamentLeaderboardUseCase {
    execute(tournamentId: string): Promise<Leaderboard>;
}

export interface IGetTournamentPointsTableUseCase {
    execute(tournamentId: string): Promise<PointsRow[]>;
}