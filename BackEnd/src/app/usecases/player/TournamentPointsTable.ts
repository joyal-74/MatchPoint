import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "../../providers/ILogger";
import { IGetTournamentPointsTable } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { PointsRow } from "domain/entities/Tournaments";
import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";

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