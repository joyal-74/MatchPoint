import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { Tournament } from "domain/entities/Tournaments";
import { IGetPlayerTournaments } from "app/repositories/interfaces/player/ITournamentsRepoUsecaes";


export class FetchTournamentsUseCase implements IGetPlayerTournaments {
    constructor(
        private tournamentRepo: ITournamentRepository,
        private registrationRepo: IRegistrationRepository,
        private teamRepo: ITeamRepository,
        private logger: ILogger
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
