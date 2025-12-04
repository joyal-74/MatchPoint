import { Types } from "mongoose";
import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { NotFoundError } from "domain/errors";
import { IAddWicketUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

export class AddWicketUseCase implements IAddWicketUseCase {
    constructor(private readonly repo: IMatchScoreRepository) {}

    async execute({
        matchId,
        dismissalType,
        outBatsmanId,
        nextBatsmanId,
        fielderId
    }: {
        matchId: string;
        dismissalType: string;
        outBatsmanId: string;
        nextBatsmanId: string;
        fielderId?: string;
    }) {
        const match = await this.repo.getMatch(matchId);
        if (!match) throw new NotFoundError("Match not found");

        const inn = match.currentInnings === 1 ? match.innings1 : match.innings2;
        if (!inn) throw new Error("Innings not initialized");

        inn.wickets++;
        inn.balls++;

        const outBatsman = inn.batsmen.find(
            b => b.playerId.toString() === outBatsmanId
        );

        if (!outBatsman) {
            throw new Error("Out batsman not found in innings");
        }

        outBatsman.out = true;
        outBatsman.dismissalType = dismissalType;
        if (fielderId) outBatsman.fielderId = new Types.ObjectId(fielderId);


        const isStrikerOut =
            inn.currentStriker &&
            inn.currentStriker.toString() === outBatsmanId;


        if (isStrikerOut) {
            inn.currentStriker = new Types.ObjectId(nextBatsmanId);
        }


        inn.batsmen.push({
            playerId: new Types.ObjectId(nextBatsmanId),
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false
        });

        await this.repo.save(match);
        return this.repo.getMatch(matchId);
    }
}
