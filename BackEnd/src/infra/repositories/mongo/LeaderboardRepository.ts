import { Types } from "mongoose";
import { ILeaderboardRepository } from "../../../app/repositories/interfaces/shared/ILeaderboardRepository";
import { LeaderBoardPlayer } from "../../../domain/entities/Player";
import { PlayerModel } from "../../databases/mongo/models/PlayerModel";
import { TournamentMatchStatsModel } from "../../databases/mongo/models/TournamentStatsModel";
import { Leaderboard, MvpBoard, RunsBoard, WicketBoard } from "../../../domain/entities/Tournaments";


export class LeaderboardRepository implements ILeaderboardRepository {
    async getLeaderboard(role: string, search: string, timePeriod: string, page: number, limit: number): Promise<{ topPlayers: LeaderBoardPlayer[]; leaderboard: LeaderBoardPlayer[] }> {

        const pipeline: any[] = [
            { $match: { sport: { $regex: /^cricket$/i } } },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "user.firstName": { $regex: search, $options: "i" } },
                        { "user.lastName": { $regex: search, $options: "i" } },
                        { "user.username": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }

        if (role) {
            pipeline.push({ $match: { "profile.position": role } });
        }

        pipeline.push(
            {
                $project: {
                    name: { $concat: [{ $ifNull: ["$user.firstName", ""] }, " ", { $ifNull: ["$user.lastName", ""] }] },
                    handle: { $ifNull: ["$user.username", ""] },
                    role: { $ifNull: ["$profile.position", ""] },

                    runs: { $ifNull: ["$stats.batting.runs", 0] },
                    matches: { $ifNull: ["$stats.batting.matches", 0] },
                    average: { $ifNull: ["$stats.batting.average", 0] },
                    hundreds: { $ifNull: ["$stats.batting.hundreds", 0] },
                    fifties: { $ifNull: ["$stats.batting.fifties", 0] },
                    strikeRate: { $ifNull: ["$stats.batting.strikeRate", 0] },
                    best: { $ifNull: ["$stats.batting.highestScore", ""] },
                    isCentury: { $gt: [{ $ifNull: ["$stats.batting.hundreds", 0] }, 0] }
                }
            },
            { $sort: { runs: -1 } }
        );

        // 5. Execute aggregation to fetch all sorted players
        const allPlayers = await PlayerModel.aggregate(pipeline);

        // 6. Manual in-memory pagination (as per original requirement)
        const topPlayers = allPlayers.slice(0, 4) as LeaderBoardPlayer[];
        const remainingPlayers = allPlayers.slice(4);

        const start = (page - 1) * limit;
        const end = start + limit;
        const leaderboard = remainingPlayers.slice(start, end) as LeaderBoardPlayer[];

        return { topPlayers, leaderboard };
    }


    async getTournamentLeaderboard(tournamentId: string): Promise<Leaderboard> {
        const objectId = new Types.ObjectId(tournamentId);

        // Top Runs Scorer - FIXED with proper team lookup
        const topRunsStats = await TournamentMatchStatsModel.aggregate([
            { $match: { tournamentId: objectId } },

            // Extract batsmen from both innings
            {
                $project: {
                    innings1Batsmen: { $ifNull: ["$innings1.batsmen", []] },
                    innings2Batsmen: { $ifNull: ["$innings2.batsmen", []] }
                }
            },
            {
                $project: {
                    allBatsmen: {
                        $concatArrays: ["$innings1Batsmen", "$innings2Batsmen"]
                    }
                }
            },
            { $unwind: "$allBatsmen" },

            // Filter out null/undefined playerIds
            { $match: { "allBatsmen.playerId": { $ne: null } } },

            // Group by player
            {
                $group: {
                    _id: "$allBatsmen.playerId",
                    runs: { $sum: "$allBatsmen.runs" }
                }
            },
            { $sort: { runs: -1 } },
            { $limit: 5 },

            // Join with players collection
            {
                $lookup: {
                    from: "players",
                    localField: "_id",
                    foreignField: "_id",
                    as: "player"
                }
            },
            { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },

            // Join with users collection to get names
            {
                $lookup: {
                    from: "users",
                    localField: "player.userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            // Join with teams collection - Look for team where player is a member
            {
                $lookup: {
                    from: "teams",
                    let: { playerId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$playerId", "$members.playerId"]
                                }
                            }
                        },
                        { $limit: 1 } // Take first team found (assuming player is only in one team)
                    ],
                    as: "team"
                }
            },
            { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },

            // Project final structure
            {
                $project: {
                    playerId: "$_id",
                    name: {
                        $concat: [
                            { $ifNull: ["$user.firstName", ""] },
                            " ",
                            { $ifNull: ["$user.lastName", "Unknown Player"] }
                        ]
                    },
                    teamName: { $ifNull: ["$team.name", "No Team"] },
                    value: "$runs",
                    _id: 0
                }
            }
        ]);


        // Top Wicket Taker - Same fix
        const topWicketsStats = await TournamentMatchStatsModel.aggregate([
            { $match: { tournamentId: objectId } },

            // Extract bowlers from both innings
            {
                $project: {
                    innings1Bowlers: { $ifNull: ["$innings1.bowlers", []] },
                    innings2Bowlers: { $ifNull: ["$innings2.bowlers", []] }
                }
            },
            {
                $project: {
                    allBowlers: {
                        $concatArrays: ["$innings1Bowlers", "$innings2Bowlers"]
                    }
                }
            },
            { $unwind: "$allBowlers" },

            // Filter out null/undefined
            { $match: { "allBowlers.playerId": { $ne: null } } },

            // Group by player
            {
                $group: {
                    _id: "$allBowlers.playerId",
                    wickets: { $sum: "$allBowlers.wickets" }
                }
            },
            { $sort: { wickets: -1 } },
            { $limit: 5 },

            // Join with players collection
            {
                $lookup: {
                    from: "players",
                    localField: "_id",
                    foreignField: "_id",
                    as: "player"
                }
            },
            { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },

            // Join with users collection
            {
                $lookup: {
                    from: "users",
                    localField: "player.userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            // Join with teams collection - Look for team where player is a member
            {
                $lookup: {
                    from: "teams",
                    let: { playerId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$playerId", "$members.playerId"]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: "team"
                }
            },
            { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },

            // Project final structure
            {
                $project: {
                    playerId: "$_id",
                    name: {
                        $concat: [
                            { $ifNull: ["$user.firstName", ""] },
                            " ",
                            { $ifNull: ["$user.lastName", "Unknown Player"] }
                        ]
                    },
                    teamName: { $ifNull: ["$team.name", "No Team"] },
                    value: "$wickets",
                    _id: 0
                }
            }
        ]);


        // Most Valuable Player - Fixed with team lookup
        const mvpStats = await TournamentMatchStatsModel.aggregate([
            { $match: { tournamentId: objectId } },

            // Create a combined array of all players with their contributions
            {
                $project: {
                    players: {
                        $concatArrays: [
                            // Batsmen from innings1
                            {
                                $map: {
                                    input: { $ifNull: ["$innings1.batsmen", []] },
                                    as: "b",
                                    in: {
                                        playerId: "$$b.playerId",
                                        runs: "$$b.runs",
                                        wickets: 0,
                                        catches: { $cond: [{ $eq: ["$$b.fielderId", null] }, 0, 1] }
                                    }
                                }
                            },
                            // Batsmen from innings2
                            {
                                $map: {
                                    input: { $ifNull: ["$innings2.batsmen", []] },
                                    as: "b",
                                    in: {
                                        playerId: "$$b.playerId",
                                        runs: "$$b.runs",
                                        wickets: 0,
                                        catches: { $cond: [{ $eq: ["$$b.fielderId", null] }, 0, 1] }
                                    }
                                }
                            },
                            // Bowlers from innings1
                            {
                                $map: {
                                    input: { $ifNull: ["$innings1.bowlers", []] },
                                    as: "w",
                                    in: {
                                        playerId: "$$w.playerId",
                                        runs: 0,
                                        wickets: "$$w.wickets",
                                        catches: 0
                                    }
                                }
                            },
                            // Bowlers from innings2
                            {
                                $map: {
                                    input: { $ifNull: ["$innings2.bowlers", []] },
                                    as: "w",
                                    in: {
                                        playerId: "$$w.playerId",
                                        runs: 0,
                                        wickets: "$$w.wickets",
                                        catches: 0
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            { $unwind: "$players" },

            // Filter out null playerIds
            { $match: { "players.playerId": { $ne: null } } },

            // Group by player and calculate points
            {
                $group: {
                    _id: "$players.playerId",
                    totalRuns: { $sum: "$players.runs" },
                    totalWickets: { $sum: "$players.wickets" },
                    totalCatches: { $sum: "$players.catches" }
                }
            },

            // Calculate MVP points
            {
                $project: {
                    playerId: "$_id",
                    points: {
                        $add: [
                            "$totalRuns",                    // 1 point per run
                            { $multiply: ["$totalWickets", 20] }, // 20 points per wicket
                            { $multiply: ["$totalCatches", 10] }  // 10 points per catch
                        ]
                    }
                }
            },

            { $sort: { points: -1 } },
            { $limit: 5 },

            // Join with players collection
            {
                $lookup: {
                    from: "players",
                    localField: "playerId",
                    foreignField: "_id",
                    as: "player"
                }
            },
            { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },

            // Join with users collection
            {
                $lookup: {
                    from: "users",
                    localField: "player.userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            // Join with teams collection - Look for team where player is a member
            {
                $lookup: {
                    from: "teams",
                    let: { playerId: "$playerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$playerId", "$members.playerId"]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: "team"
                }
            },
            { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },

            // Project final structure
            {
                $project: {
                    playerId: 1,
                    name: {
                        $concat: [
                            { $ifNull: ["$user.firstName", ""] },
                            " ",
                            { $ifNull: ["$user.lastName", "Unknown Player"] }
                        ]
                    },
                    teamName: { $ifNull: ["$team.name", "No Team"] },
                    value: { $round: ["$points", 1] },
                    _id: 0
                }
            }
        ]);


        return {
            tournamentId,
            topRuns: topRunsStats as RunsBoard[],
            topWickets: topWicketsStats as WicketBoard[],
            mvp: mvpStats as MvpBoard[]
        };
    }
}
