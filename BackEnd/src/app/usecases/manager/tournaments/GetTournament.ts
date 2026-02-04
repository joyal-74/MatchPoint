import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IGetTournamentById } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { ILogger } from "../../../providers/ILogger.js";
import { Tournament } from "../../../../domain/entities/Tournaments.js";
import { NotFoundError } from "../../../../domain/errors/index.js";


@injectable()
export class GetTournamentByIdUseCase implements IGetTournamentById {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Tournament> {
        this.logger.info(`[GetTournamentByIdUseCase] Fetching tournament id=${tournamentId}`);
        const tournament = await this._tournamentRepo.findById(tournamentId);

        if (!tournament) {
            this.logger.warn(`[GetTournamentByIdUseCase] Tournament not found id=${tournamentId}`);
            throw new NotFoundError("Tournament not found");
        }

        this.logger.info(`[GetTournamentByIdUseCase] Tournament fetched id=${tournamentId}`);
        return tournament;
    }
}
