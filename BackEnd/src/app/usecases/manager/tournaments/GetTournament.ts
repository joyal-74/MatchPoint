import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IGetTournamentById } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";

export class GetTournamentByIdUseCase implements IGetTournamentById {
    constructor(private _tournamentRepo: ITournamentRepository, private logger: ILogger) {}

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
