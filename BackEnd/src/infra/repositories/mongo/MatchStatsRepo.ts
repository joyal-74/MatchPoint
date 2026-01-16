import { TournamentMatchStatsModel } from "infra/databases/mongo/models/TournamentStatsModel";
import { MatchEntity } from "domain/entities/MatchEntity";
import { MatchStatsMapper } from "infra/utils/mappers/MatchStatsMapper";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";

export class MatchRepoMongo implements IMatchStatsRepo {
    async findByMatchId(matchId: string): Promise<MatchEntity | null> {
        const doc = await TournamentMatchStatsModel.findOne({ matchId }).lean();
        if (!doc) return null;

        return MatchStatsMapper.toDomain(doc);
    }

    async findLiveMatches({limit = 10}) {
        return TournamentMatchStatsModel.aggregate([
            { $match: { status: "ongoing" } },
            { $sort: { updatedAt: -1 } },
            { $limit: limit },

            // Join Match
            {
                $lookup: {
                    from: "matches",
                    localField: "matchId",
                    foreignField: "_id",
                    as: "match"
                }
            },
            { $unwind: "$match" },

            // Join Team A
            {
                $lookup: {
                    from: "teams",
                    localField: "match.teamA",
                    foreignField: "_id",
                    as: "teamA"
                }
            },
            { $unwind: "$teamA" },

            // Join Team B
            {
                $lookup: {
                    from: "teams",
                    localField: "match.teamB",
                    foreignField: "_id",
                    as: "teamB"
                }
            },
            { $unwind: "$teamB" },

            {
                $project: {
                    matchId: "$match._id",

                    teamA: {
                        name: "$teamA.name",
                        logo: "$teamA.logo"
                    },
                    teamB: {
                        name: "$teamB.name",
                        logo: "$teamB.logo"
                    },

                    scoreA: {
                        $concat: [
                            { $toString: "$innings1.runs" },
                            "/",
                            { $toString: "$innings1.wickets" }
                        ]
                    },
                    oversA: {
                        $concat: [
                            { $toString: { $floor: { $divide: ["$innings1.legalBalls", 6] } } },
                            ".",
                            { $toString: { $mod: ["$innings1.legalBalls", 6] } }
                        ]
                    },

                    scoreB: {
                        $cond: [
                            { $ifNull: ["$innings2", false] },
                            {
                                $concat: [
                                    { $toString: "$innings2.runs" },
                                    "/",
                                    { $toString: "$innings2.wickets" }
                                ]
                            },
                            "-"
                        ]
                    },
                    oversB: {
                        $cond: [
                            { $ifNull: ["$innings2", false] },
                            {
                                $concat: [
                                    { $toString: { $floor: { $divide: ["$innings2.legalBalls", 6] } } },
                                    ".",
                                    { $toString: { $mod: ["$innings2.legalBalls", 6] } }
                                ]
                            },
                            "-"
                        ]
                    },

                    isStreamLive: "$match.isStreamLive"
                }
            }
        ]);
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

    async updateStatus(matchId: string, status: string): Promise<boolean> {
        const doc = await TournamentMatchStatsModel.findOneAndUpdate(
            { matchId },
            { $set: { status } },
            { new: true }
        );

        return !!doc;
    }
}
