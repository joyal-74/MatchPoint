import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IAddWicketUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { AddWicketPayload } from "domain/entities/Innings";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class AddWicketUseCase implements IAddWicketUseCase {
    constructor(private matchRepo: IMatchStatsRepo) {}

    async execute(payload: AddWicketPayload): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(payload.matchId);
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

        return await this.matchRepo.save(match);
    }
}