import { Types } from "mongoose";
import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { TournamentMatchStatsDocument } from "infra/databases/mongo/models/TournamentMatchStatsModel";
import { AddRunsPayload, IAddRunsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";


export class AddRunsUseCase implements IAddRunsUseCase {
    constructor(
        private _matchScoreRepo: IMatchScoreRepository
    ) { }

    async execute({ matchId, runs }: AddRunsPayload): Promise<TournamentMatchStatsDocument> {

        let match = await this._matchScoreRepo.getMatch(matchId);
        if (!match) {
            match = await this._matchScoreRepo.createInitialMatch(matchId);
            if (!match) throw new Error("Failed to create initial match document");
        }

        const inn = match.currentInnings === 1 ? match.innings1 : match.innings2;
        if (!inn) throw new Error("Innings not initialized");

        // Ensure currentStriker/currentBowler exist (defensive)
        if (!inn.currentStriker) {
            throw new Error("Current striker not set");
        }
        if (!inn.currentBowler) {
            throw new Error("Current bowler not set");
        }

        // Update innings aggregate
        inn.runs = (inn.runs || 0) + runs;
        inn.balls = (inn.balls || 0) + 1;

        // Striker update: find batsman entry (compare string form of ids)
        const strikerEntry = inn.batsmen.find((b) => b.playerId.toString() === inn.currentStriker?.toString());

        if (strikerEntry) {
            strikerEntry.runs = (strikerEntry.runs || 0) + runs;
            strikerEntry.balls = (strikerEntry.balls || 0) + 1;
            if (runs === 4) strikerEntry.fours = (strikerEntry.fours || 0) + 1;
            if (runs === 6) strikerEntry.sixes = (strikerEntry.sixes || 0) + 1;
        } else {
            // If batsman not present, create an entry (use ObjectId to keep schema)
            inn.batsmen.push({
                playerId: new Types.ObjectId(inn.currentStriker),
                runs: runs,
                balls: 1,
                fours: runs === 4 ? 1 : 0,
                sixes: runs === 6 ? 1 : 0,
                out: false
            });
        }

        // Bowler update
        const bowlerEntry = inn.bowlers.find(
            b => b.playerId.toString() === inn.currentBowler?.toString()
        );
        
        if (bowlerEntry) {
            bowlerEntry.runsConceded = (bowlerEntry.runsConceded || 0) + runs;
            bowlerEntry.balls = (bowlerEntry.balls || 0) + 1;

            if (bowlerEntry.balls === 6) {
                bowlerEntry.overs = (bowlerEntry.overs || 0) + 1;
                bowlerEntry.balls = 0;
            }
        } else {
            // create bowler entry if not exists
            inn.bowlers.push({
                playerId: new Types.ObjectId(inn.currentBowler),
                overs: 0,
                balls: 1,
                runsConceded: runs,
                wickets: 0
            });
        }

        // Rotate strike for odd runs
        if (runs % 2 === 1) {
            const tmp = inn.currentStriker;
            inn.currentStriker = inn.currentNonStriker;
            inn.currentNonStriker = tmp;
        }

        // Over complete -> swap strike (if balls mod 6 == 0)
        if (inn.balls % 6 === 0) {
            const tmp = inn.currentStriker;
            inn.currentStriker = inn.currentNonStriker;
            inn.currentNonStriker = tmp;
        }

        // Persist
        await this._matchScoreRepo.save(match);

        const updated = await this._matchScoreRepo.getMatch(matchId);
        if (!updated) throw new Error("Failed to fetch updated match");
        return updated;
    }
}
