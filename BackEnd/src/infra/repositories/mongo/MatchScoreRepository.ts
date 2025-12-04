
import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { TournamentMatchStatsDocument, TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentMatchStatsModel";
import { Types } from "mongoose";

export class MatchScoreRepository implements IMatchScoreRepository {

    async getMatch(matchId: string): Promise<TournamentMatchStatsDocument | null> {
        return await TournamentMatchStatsModel.findOne({
            matchId: new Types.ObjectId(matchId)
        });
    }

    async createInitialMatch(matchId: string): Promise<TournamentMatchStatsDocument> {
        return TournamentMatchStatsModel.create({
            matchId: new Types.ObjectId(matchId),
            currentInnings: 1,
            innings1: {
                battingTeamId: null,
                bowlingTeamId: null,
                runs: 0,
                wickets: 0,
                balls: 0,
                batsmen: [],
                bowlers: [],
                currentStriker: null,
                currentNonStriker: null,
                currentBowler: null
            },
            innings2: {
                battingTeamId: null,
                bowlingTeamId: null,
                runs: 0,
                wickets: 0,
                balls: 0,
                batsmen: [],
                bowlers: [],
                currentStriker: null,
                currentNonStriker: null,
                currentBowler: null
            }
        });
    }

    async save(doc: TournamentMatchStatsDocument): Promise<void> {
        await doc.save();
    }
}
