import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ILeaderboardRepository } from "../../repositories/interfaces/shared/ILeaderboardRepository";
import { LeaderboardDTO } from "../../../domain/dtos/LeaderboardDTO";


interface GetLeaderboardParams {
    role: string;
    search: string;
    timePeriod: string;
    page: number;
    limit: number;
}

@injectable()
export class GetLeaderboard {
    constructor(
        @inject(DI_TOKENS.LeaderboardRepository) private _leaderboardRepo: ILeaderboardRepository
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
