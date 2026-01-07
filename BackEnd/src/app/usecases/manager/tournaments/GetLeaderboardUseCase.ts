import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILeaderboardRepository } from "app/repositories/interfaces/shared/ILeaderboardRepository";
import { IGetTourLeaderboard } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { Leaderboard } from "domain/entities/Tournaments";

@injectable()
export class GetTourLeaderboard implements IGetTourLeaderboard {
    constructor(
        @inject(DI_TOKENS.LeaderboardRepository) private _leaderboardRepo: ILeaderboardRepository
    ) { }

    async execute(tournamentId: string): Promise<Leaderboard> {
        const leaderboard = this._leaderboardRepo.getTournamentLeaderboard(tournamentId);
        return leaderboard;
    }
}