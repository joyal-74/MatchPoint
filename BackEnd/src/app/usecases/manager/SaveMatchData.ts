import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ISaveMatchData } from "../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository";
import { ILogger } from "../../providers/ILogger";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index";
import { MatchEntity } from "../../../domain/entities/MatchEntity";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo";


@injectable()
export class SaveMatchData implements ISaveMatchData {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepo: IMatchesRepository,
        @inject(DI_TOKENS.MatchStatsRepository) private _matchstatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity> {
        if (!matchId) throw new NotFoundError("Match ID is required");
        if (!tossWinnerId) throw new NotFoundError("Toss winner ID is required");
        if (!tossDecision) throw new NotFoundError("Toss decision is required");

        const result = await this._matchRepo.updateTossDetails(matchId, tossWinnerId, tossDecision);
        await this._matchstatsRepo.updateStatus(matchId, 'ongoing');

        if(!result) throw new BadRequestError('Toss update faiiled')

        this._logger.info(
            `Match ${matchId}: Toss updated → winner=${tossWinnerId}, decision=${tossDecision}`
        );

        return result;
    }
}
