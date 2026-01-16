import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "../../providers/ILogger";
import { Tournament } from "domain/entities/Tournaments";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { NotFoundError } from "domain/errors";
import { ITournamentDetails } from "app/repositories/interfaces/player/ITournamentUsecases";


@injectable()
export class PlayerTournamentDetails implements ITournamentDetails {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(id: string, ): Promise<Tournament> {

        this.logger.info(`[Fetching tournament details] tournamentid=${id}`);

        const result = await this._tourRepo.findById(id);
        if(!result){
            throw new NotFoundError('Tournament not found')
        }

        return result;
    }
}