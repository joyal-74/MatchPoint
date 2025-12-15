import { ILeaderboardRepository } from "app/repositories/interfaces/shared/ILeaderboardRepository";
import { IGetTourLeaderboard } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { Leaderboard } from "domain/entities/Tournaments";


export class GetTourLeaderboard implements IGetTourLeaderboard {
    constructor(
        private _leaderboardRepo: ILeaderboardRepository
    ) { }

    async execute(tournamentId: string): Promise<Leaderboard> {
        const leaderboard = this._leaderboardRepo.getTournamentLeaderboard(tournamentId);
        console.log(leaderboard)
        return leaderboard;
    }
}