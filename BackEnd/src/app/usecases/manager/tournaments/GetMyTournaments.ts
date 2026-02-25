import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IGetMyTournaments } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../../providers/ILogger";


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
