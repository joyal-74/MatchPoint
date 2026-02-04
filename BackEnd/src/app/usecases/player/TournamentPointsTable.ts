import { inject, injectable } from "tsyringe";
import { ILogger } from "../../providers/ILogger.js";
import { IPointsTableRepository } from "../../repositories/interfaces/shared/IPointsTableRepository.js";
import { IGetTournamentPointsTable } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { PointsRow } from "../../../domain/entities/PointsTable.js";


@injectable()
export class GetTournamentPointsTable implements IGetTournamentPointsTable {
    constructor(
        @inject(DI_TOKENS.PointsTableRepository) private _pointsTableRepo: IPointsTableRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(tournamentId : string): Promise<PointsRow[]> {

        this.logger.info(`[Fetching Matches] for tournament=${tournamentId}`);

        const result = await this._pointsTableRepo.findByTournamentId(tournamentId);

        return result;
    }
}
