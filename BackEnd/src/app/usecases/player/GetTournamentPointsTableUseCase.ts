import { injectable, inject } from 'tsyringe';
import { DI_TOKENS } from '../../../domain/constants/Identifiers.js';
import { IGetTournamentPointsTableUseCase } from '../../repositories/interfaces/player/ITournamentUsecases.js';
import { IPointsTableRepository } from '../../repositories/interfaces/shared/IPointsTableRepository.js';
import { PointsRow } from '../../../domain/entities/PointsTable.js';



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
