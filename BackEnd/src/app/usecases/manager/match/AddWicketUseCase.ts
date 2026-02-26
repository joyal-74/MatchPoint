import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IAddWicketUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";
import { AddWicketPayload } from "../../../../domain/entities/Innings";
import { NotFoundError } from "../../../../domain/errors/index";


@injectable()
export class AddWicketUseCase implements IAddWicketUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) {}

    async execute(payload: AddWicketPayload): Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(payload.matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addWicketToCurrentInnings({
            matchId: payload.matchId,
            outBatsmanId: payload.outBatsmanId,
            nextBatsmanId : payload.nextBatsmanId,
            bowlerId: payload.bowlerId,
            dismissalType: payload.dismissalType,
            fielderId: payload.fielderId ?? null,
            isLegalBall: payload.isLegalBall,
            runsCompleted: payload.runsCompleted ?? 0
        });

        return await this._matchStatsRepo.save(match);
    }
}
