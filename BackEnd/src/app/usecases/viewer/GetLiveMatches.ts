import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { LiveMatchMapper } from "app/mappers/LiveMatchMapper";
import { ILogger } from "app/providers/ILogger";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IGetLiveMatches } from "app/repositories/interfaces/usecases/IViewerUsecaseRepository";
import { LiveMatchDTO } from "domain/dtos/LiveMatchDTO";

@injectable()
export class GetLiveMatches implements IGetLiveMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo : ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(): Promise<LiveMatchDTO[]> {
        const matches = await this._matchRepo.findLiveMatches();

        if (!matches || matches.length === 0) {
            this._logger.info("No live matches found");
            return [];
        }

        const result = await Promise.all(
            matches.map(async (match) => {
                const teamA = await this._teamRepo.findById(match.innings1.battingTeam!);
                const teamB = await this._teamRepo.findById(match.innings1.bowlingTeam!);

                const tournament = await this._tournamentRepo.findById(match.tournamentId);

                return LiveMatchMapper.toDTO(match, teamA!, teamB!, tournament!);
            })
        );

        this._logger.info(`Live matches fetched`, { count: result.length });

        return result;
    }
}
