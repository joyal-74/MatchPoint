import { injectable, inject } from 'tsyringe';
import { PointsRow } from 'domain/entities/Tournaments'; 
import { DI_TOKENS } from 'domain/constants/Identifiers';
import { IGetTournamentPointsTableUseCase } from 'app/repositories/interfaces/player/ITournamentUsecases';
import { ITournamentRepository } from 'app/repositories/interfaces/shared/ITournamentRepository';


@injectable()
export class GetTournamentPointsTableUseCase implements IGetTournamentPointsTableUseCase { 
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepo: ITournamentRepository
    ) { }

    async execute(tournamentId: string): Promise<PointsRow[]> {
        const pointsTable = await this._tourRepo.getPointsTable(tournamentId);

        return pointsTable;
    }
}