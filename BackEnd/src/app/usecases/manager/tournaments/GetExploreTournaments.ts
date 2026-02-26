import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IGetExploreTournaments } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../../providers/ILogger";
import { Tournament } from "../../../../domain/entities/Tournaments";


@injectable()
export class ExploreTournamentsUseCase implements IGetExploreTournaments {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(managerId: string, page: number, limit: number, search: string, filter: string): Promise<Tournament[]> {

        this._logger.info(`[GetExploreTournamentsUseCase] Fetching explore tournaments based on filters`);

        const tournaments = await this._tournamentRepo.getExploreTournaments(managerId, page, limit, search, filter) ?? [];

        this._logger.info(`[GetExploreTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}
