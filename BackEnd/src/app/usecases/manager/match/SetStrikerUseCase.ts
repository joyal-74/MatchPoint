import { Types } from "mongoose";
import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { ISetStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

export class SetStrikerUseCase implements ISetStrikerUseCase {
    constructor(private readonly repo: IMatchScoreRepository) { }

    async execute(matchId: string, batsmanId: string) {
        const match = await this.repo.getMatch(matchId);
        if (!match) throw new Error("Match not found");

        const inn = match.currentInnings === 1 ? match.innings1 : match.innings2;
        if (!inn) throw new Error("Innings not initialized");

        inn.currentStriker = new Types.ObjectId(batsmanId);

        await this.repo.save(match);
        return this.repo.getMatch(matchId);
    }
}
