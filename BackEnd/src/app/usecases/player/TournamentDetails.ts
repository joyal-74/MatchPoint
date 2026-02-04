import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ITournamentDetails } from "../../repositories/interfaces/player/ITournamentUsecases.js";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Tournament } from "../../../domain/entities/Tournaments.js";
import { NotFoundError } from "../../../domain/errors/index.js";



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
