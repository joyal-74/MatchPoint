import { LiveMatchMapper } from "app/mappers/LiveMatchMapper";
import { ILogger } from "app/providers/ILogger";
import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IGetLiveMatches } from "app/repositories/interfaces/usecases/IViewerUsecaseRepository";
import { LiveMatchDTO } from "domain/dtos/LiveMatchDTO";

export class GetLiveMatches implements IGetLiveMatches {
    constructor(
        private _matchRepo: IMatchRepo,
        private _teamRepo: ITeamRepository,
        private _tournamentRepo : ITournamentRepository,
        private _logger: ILogger
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

                return LiveMatchMapper.toDTO(match, teamA!, teamB!, tournament?.location ?? '');
            })
        );

        this._logger.info(`Live matches fetched`, { count: result.length });

        return result;
    }
}
