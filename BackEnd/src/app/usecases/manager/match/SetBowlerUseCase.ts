import { Types } from "mongoose";
import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { ISetBowlerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

export class SetBowlerUseCase implements ISetBowlerUseCase {
    constructor(private repo: IMatchScoreRepository) {}

    async execute(matchId: string, bowlerId: string) {
        const match = await this.repo.getMatch(matchId);
        if (!match) throw new Error("Match not found");

        const inn = match.currentInnings === 1 ? match.innings1 : match.innings2;
        if (!inn) throw new Error("Innings not initialized");

        inn.currentBowler = new Types.ObjectId(bowlerId);

        // Ensure bowler entry exists
        const exist = inn.bowlers.some(b => b.playerId.toString() === bowlerId);
        if (!exist) {
            inn.bowlers.push({
                playerId: new Types.ObjectId(bowlerId),
                overs: 0,
                balls: 0,
                runsConceded: 0,
                wickets: 0,
            });
        }

        await this.repo.save(match);
        return this.repo.getMatch(matchId);
    }
}
