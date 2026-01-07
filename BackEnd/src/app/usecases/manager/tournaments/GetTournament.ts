import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IGetTournamentById } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";

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
