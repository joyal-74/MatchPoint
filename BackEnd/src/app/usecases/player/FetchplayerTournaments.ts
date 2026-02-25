import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetPlayerTournaments } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { IRegistrationRepository } from "../../repositories/interfaces/manager/IRegistrationRepository";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { Tournament } from "../../../domain/entities/Tournaments";


@injectable()
export class FetchTournamentsUseCase implements IGetPlayerTournaments {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.RegistrationRepository) private registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.TeamRepository) private teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(status: string, page: number, limit: number, playerId?: string,): Promise<{ tournaments: Tournament[]; total: number }> {

        this.logger.info(`[FetchTournaments] status=${status}`);

        if (status === "registered" && playerId) {

            const teams = await this.teamRepo.findAllWithUserId(playerId, "approved");
            const teamIds = teams.teams.map(t => t._id);

            if (!teamIds.length) return { tournaments: [], total: 0 };

            const registrations = await this.registrationRepo.findByTeamIds(teamIds);
            if (!registrations?.length) return { tournaments: [], total: 0 };

            const tournamentIds = registrations.map(r => r.tournamentId);
            if (!tournamentIds.length) return { tournaments: [], total: 0 };

            const { tournaments, total } = await this.tournamentRepo.findManyByIds(
                tournamentIds,
                page,
                limit
            );

            this.logger.info(`[FetchTournaments] Registered tournaments found: ${tournaments.length}`);

            return { tournaments, total };
        }

        const result = await this.tournamentRepo.findByFilters({ status, page, limit });

        return {
            tournaments: result.tournaments,
            total: result.total
        };
    }
}
