import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";
import { IGetMyTournaments } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";

@injectable()
export class GetMyTournamentsUseCase implements IGetMyTournaments {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(managerId: string) {
        this._logger.info(`[GetMyTournamentsUseCase] Fetching tournaments for managerId=${managerId}`);

        const tournaments = await this._tournamentRepo.getByManager(managerId) ?? [];

        this._logger.info(`[GetMyTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}