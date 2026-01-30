import { injectable, inject } from 'tsyringe';
import { DI_TOKENS } from 'domain/constants/Identifiers';
import { IGetTournamentPointsTableUseCase } from 'app/repositories/interfaces/player/ITournamentUsecases';
import { IPointsTableRepository } from 'app/repositories/interfaces/shared/IPointsTableRepository';
import { PointsRow } from 'domain/entities/PointsTable';


@injectable()
export class GetTournamentPointsTableUseCase implements IGetTournamentPointsTableUseCase { 
    constructor(
        @inject(DI_TOKENS.PointsTableRepository) private _pointsRepo: IPointsTableRepository
    ) { }

    async execute(tournamentId: string): Promise<PointsRow[]> {
        const pointsTable = await this._pointsRepo.findByTournamentId(tournamentId);

        return pointsTable;
    }
}