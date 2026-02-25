import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetLiveMatches } from "../../repositories/interfaces/usecases/IViewerUsecaseRepository";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../providers/ILogger";
import { LiveMatchDTO } from "../../../domain/dtos/LiveMatchDTO";
import { LiveMatchMapper } from "../../mappers/LiveMatchMapper";


@injectable()
export class GetLiveMatches implements IGetLiveMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(): Promise<LiveMatchDTO[]> {
        // 1. Get RAW documents (NOT aggregated summaries)
        const matches = await this._matchRepo.findFullLiveMatches({ limit: 10 });

        if (!matches || matches.length === 0) {
            this._logger.info("No live matches found");
            return [];
        }

        const results = await Promise.all(
            matches.map(async (match) => {
                try {
                    const currentInningsNo = match.currentInnings || 1;
                    const activeInnings = currentInningsNo === 2 ? match.innings2 : match.innings1;

                    if (!activeInnings || !activeInnings.battingTeam || !activeInnings.bowlingTeam) {
                        return null;
                    }


                    const [battingTeam, bowlingTeam, tournament] = await Promise.all([
                        this._teamRepo.findById(activeInnings.battingTeam.toString()),
                        this._teamRepo.findById(activeInnings.bowlingTeam.toString()),
                        this._tournamentRepo.findById(match.tournamentId.toString())
                    ]);

                    if (!battingTeam || !bowlingTeam || !tournament) {
                        return null;
                    }

                    // 4. Map to DTO
                    return LiveMatchMapper.toDTO(match, battingTeam, bowlingTeam, tournament);

                } catch (error) {
                    console.error(`Error processing match ${match.matchId}:`, error);
                    return null;
                }
            })
        );

        return results.filter((m): m is LiveMatchDTO => m !== null);
    }
}
