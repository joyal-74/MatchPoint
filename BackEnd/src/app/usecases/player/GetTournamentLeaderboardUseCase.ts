import { injectable, inject } from 'tsyringe';
import { Leaderboard } from 'domain/entities/Tournaments'; 
import { DI_TOKENS } from 'domain/constants/Identifiers';
import { IGetTournamentLeaderboardUseCase } from 'app/repositories/interfaces/player/ITournamentUsecases';
import { ILeaderboardRepository } from 'app/repositories/interfaces/shared/ILeaderboardRepository';


@injectable()
export class GetTournamentLeaderboardUseCase implements IGetTournamentLeaderboardUseCase { 
    constructor(
        @inject(DI_TOKENS.LeaderboardRepository) private _leaderboardRepo: ILeaderboardRepository
    ) { }

    async execute(tournamentId: string): Promise<Leaderboard> {
        const leaderboard = await this._leaderboardRepo.getTournamentLeaderboard(tournamentId);

        return leaderboard;
    }
}