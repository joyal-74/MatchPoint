import { injectable, inject } from 'tsyringe';
import { DI_TOKENS } from '../../../domain/constants/Identifiers';
import { IGetTournamentLeaderboardUseCase } from '../../repositories/interfaces/player/ITournamentUsecases';
import { ILeaderboardRepository } from '../../repositories/interfaces/shared/ILeaderboardRepository';
import { Leaderboard } from '../../../domain/entities/Tournaments';



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
