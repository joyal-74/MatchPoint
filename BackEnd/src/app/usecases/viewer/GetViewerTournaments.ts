import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetViewerTournaments } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { Tournament } from "../../../domain/entities/Tournaments";
import { ILogger } from "../../providers/ILogger";


@injectable()
export class GetViewerTournamentsUseCase implements IGetViewerTournaments {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(status: string, page: number, limit: number): Promise<{ tournaments: Tournament[]; total: number }> {

        this.logger.info(`[FetchTournaments] status=${status}`);

        const result = await this.tournamentRepo.findByFilters({ status, page, limit });

        return {
            tournaments: result.tournaments,
            total: result.total
        };
    }
}
