import { TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentStatsModel";
import { MatchEntity } from "domain/entities/MatchEntity";
import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { MatchStatsMapper } from "infra/utils/mappers/MatchStatsMapper";

export class MatchRepoMongo implements IMatchRepo {
    async findByMatchId(matchId: string): Promise<MatchEntity | null> {
        const doc = await TournamentMatchStatsModel.findOne({ matchId }).lean();
        if (!doc) return null;

        return MatchStatsMapper.toDomain(doc);
    }

    async findLiveMatches(): Promise<MatchEntity[]> {
        const docs = await TournamentMatchStatsModel
            .find({ isLive: true })
            .lean();

        if (!docs || docs.length === 0) return [];

        return docs.map(doc => MatchStatsMapper.toDomain(doc));
    }

    async save(match: MatchEntity): Promise<MatchEntity> {
        const persistence = MatchStatsMapper.toPersistence(match);

        const updatedDoc = await TournamentMatchStatsModel
            .findOneAndUpdate(
                { matchId: match.matchId },
                { $set: persistence },
                { upsert: true, new: true }
            )
            .lean();

        if (!updatedDoc) {
            throw new Error("Failed to save match");
        }

        return MatchStatsMapper.toDomain(updatedDoc);
    }
}
