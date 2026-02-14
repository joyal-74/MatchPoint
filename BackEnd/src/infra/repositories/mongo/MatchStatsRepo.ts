import { FilterQuery, Types } from "mongoose";
import { AllMatchQuery, IMatchStatsRepo, LiveMatchQuery } from "../../../app/repositories/interfaces/manager/IMatchStatsRepo.js";
import { TournamentResult } from "../../../domain/entities/Match.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";
import { TournamentMatchStatsDocument } from "../../../domain/types/match.types.js";
import { TournamentMatchStatsModel } from "../../databases/mongo/models/TournamentStatsModel.js";
import { MatchResultMapper } from "../../utils/mappers/MatchResultMapper.js";
import { MatchStatsMapper } from "../../utils/mappers/MatchStatsMapper.js";


export class MatchStatsRepository implements IMatchStatsRepo {
    async findByMatchId(matchId: string): Promise<MatchEntity | null> {
        const doc = await TournamentMatchStatsModel.findOne({ matchId }).lean();
        if (!doc) return null;

        return MatchStatsMapper.toDomain(doc);
    }

    async findAllMatches(query: AllMatchQuery): Promise<{ matches: MatchEntity[], totalPages: number }> {
        const { search, limit = 10, page = 1, userId } = query;
        const skip = (page - 1) * limit;

        // Direct, simple query
        const mongoQuery: FilterQuery<MatchEntity> = { umpire: userId };

        if (search) {
            mongoQuery.venue = { $regex: search, $options: "i" };
        }

        const [docs, totalCount] = await Promise.all([
            TournamentMatchStatsModel.find(mongoQuery)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            TournamentMatchStatsModel.countDocuments(mongoQuery)
        ]);

        return {
            matches: docs.map(doc => MatchStatsMapper.toDomain(doc)),
            totalPages: Math.ceil(totalCount / limit) || 1
        };
    }


    async findLiveMatches({ limit = 10 }) {
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
                        _id: "$teamA._id",
                        name: "$teamA.name",
                        logo: "$teamA.logo"
                    },
                    teamB: {
                        _id: "$teamB._id",
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

    async findFullLiveMatches(query: LiveMatchQuery): Promise<TournamentMatchStatsDocument[]> {
        const { limit = 10 } = query;

        const docs = await TournamentMatchStatsModel
            .find({ status: "ongoing" })
            .limit(limit)
            .lean()
            .exec();

        return docs.map(doc => ({
            ...doc,
            _id: doc._id.toString(),
            tournamentId: doc.tournamentId.toString(),
            matchId: doc.matchId.toString(),
        })) as unknown as TournamentMatchStatsDocument[];
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

    async getMatchStats(matchId: string): Promise<TournamentMatchStatsDocument | null> {
        return await TournamentMatchStatsModel.findOne({ matchId });
    }

    async getCompletedMatches(tournamentId: string): Promise<TournamentResult[]> {
        const docs = await TournamentMatchStatsModel.find({
            tournamentId: new Types.ObjectId(tournamentId),
            status: 'completed'
        })
            .populate({
                path: 'matchId',
                select: 'matchNo date venue teamA teamB round',
                populate: [
                    { path: 'teamA', select: 'name logo' },
                    { path: 'teamB', select: 'name logo' }
                ]
            })
            .sort({ updatedAt: -1 })
            .lean();

        const results = docs
            .map(doc => MatchResultMapper.toDTO(doc))
            .filter((match): match is TournamentResult => match !== null);

        return results;

    }
}
