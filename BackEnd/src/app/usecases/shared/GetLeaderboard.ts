import { ILeaderboardRepository } from "app/repositories/interfaces/shared/ILeaderboardRepository";
import { LeaderboardDTO } from "domain/dtos/LeaderboardDTO";


interface GetLeaderboardParams {
    role: string;
    search: string;
    timePeriod: string;
    page: number;
    limit: number;
}

export class GetLeaderboard {
    constructor(
        private _leaderboardRepo: ILeaderboardRepository
    ) { }

    async execute(params: GetLeaderboardParams): Promise<LeaderboardDTO> {
        return this._leaderboardRepo.getLeaderboard(
            params.role,
            params.search,
            params.timePeriod,
            params.page,
            params.limit
        );
    }
}