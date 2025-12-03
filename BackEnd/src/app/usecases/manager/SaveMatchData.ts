import { ILogger } from "app/providers/ILogger";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { ISaveMatchData } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/Match";
import { BadRequestError, NotFoundError } from "domain/errors";


export class SaveMatchData implements ISaveMatchData {
    constructor(
        private _matchRepo: IMatchesRepository,
        private _logger: ILogger
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