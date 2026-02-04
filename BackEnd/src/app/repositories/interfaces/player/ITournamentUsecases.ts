import { PointsRow } from "../../../../domain/entities/PointsTable.js";
import { Leaderboard, Tournament } from "../../../../domain/entities/Tournaments.js";

export interface ITournamentDetails {
    execute(id: string): Promise<Tournament>;
}

export interface IGetTournamentLeaderboardUseCase {
    execute(tournamentId: string): Promise<Leaderboard>;
}

export interface IGetTournamentPointsTableUseCase {
    execute(tournamentId: string): Promise<PointsRow[]>;
}
