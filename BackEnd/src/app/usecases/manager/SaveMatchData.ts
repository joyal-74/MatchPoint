import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ISaveMatchData } from "../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";


@injectable()
export class SaveMatchData implements ISaveMatchData {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepo: IMatchesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity> {
        if (!matchId) throw new NotFoundError("Match ID is required");
        if (!tossWinnerId) throw new NotFoundError("Toss winner ID is required");
        if (!tossDecision) throw new NotFoundError("Toss decision is required");

        const result = await this._matchRepo.updateTossDetails(matchId, tossWinnerId, tossDecision);

        if(!result) throw new BadRequestError('Toss update faiiled')

        this._logger.info(
            `Match ${matchId}: Toss updated → winner=${tossWinnerId}, decision=${tossDecision}`
        );

        return result;
    }
}
