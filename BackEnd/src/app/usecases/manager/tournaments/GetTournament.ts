import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IGetTournamentById } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";

export class GetTournamentByIdUseCase implements IGetTournamentById {
    constructor(private _tournamentRepo: ITournamentRepository, private logger: ILogger) {}

    async execute(tournamentId: string): Promise<Tournament> {
        this.logger.info(`[GetTournamentByIdUseCase] Fetching tournament id=${tournamentId}`);
        const tournament = await this._tournamentRepo.findById(tournamentId);

        if (!tournament) {
            this.logger.warn(`[GetTournamentByIdUseCase] Tournament not found id=${tournamentId}`);
            throw new Error("Tournament not found");
        }

        this.logger.info(`[GetTournamentByIdUseCase] Tournament fetched id=${tournamentId}`);
        return tournament;
    }
}
