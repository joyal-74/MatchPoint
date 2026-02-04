import { inject, injectable } from "tsyringe";
import { IGetTourLeaderboard } from "../../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { ILeaderboardRepository } from "../../../repositories/interfaces/shared/ILeaderboardRepository.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { Leaderboard } from "../../../../domain/entities/Tournaments.js";


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
