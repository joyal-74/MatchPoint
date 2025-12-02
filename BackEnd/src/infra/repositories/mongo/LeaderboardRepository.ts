import { ILeaderboardRepository } from "app/repositories/interfaces/shared/ILeaderboardRepository";
import { LeaderBoardPlayer } from "domain/entities/Player";
import { PlayerModel } from "infra/databases/mongo/models/PlayerModel";

export class LeaderboardRepository implements ILeaderboardRepository {
    async getLeaderboard(
        role: string,
        search: string,
        timePeriod: string,
        page: number,
        limit: number
    ): Promise<{ topPlayers: LeaderBoardPlayer[]; leaderboard: LeaderBoardPlayer[] }> {

        const pipeline: any[] = [
            {
                $match: {
                    sport: { $regex: /^cricket$/i }
                }
            },
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

        // SEARCH FILTER
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

        // ROLE FILTER
        if (role) {
            pipeline.push({
                $match: {
                    "profile.position": role
                }
            });
        }

        // YEAR FILTER
        if (timePeriod && timePeriod !== "All Time") {
            const year = Number(timePeriod);
            pipeline.push({
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                }
            });
        }

        // AGGREGATE
        const players = await PlayerModel.aggregate(pipeline);

        // MAP RESPONSE
        const mappedPlayers = players.map<LeaderBoardPlayer>(player => {
            const batting = player.stats?.batting || {};

            return {
                name: `${player.user?.firstName || ""} ${player.user?.lastName || ""}`.trim(),
                handle: player.user?.username || "",
                matches: batting.matches || 0,
                runs: batting.runs?.toString() || "0",
                average: batting.average || 0,
                hundreds: batting.hundreds || 0,
                fifties: batting.fifties || 0,
                strikeRate: batting.strikeRate || 0,
                role: player.profile?.position || "Batter",
                best: batting.highestScore || "",
                isCentury: (batting.hundreds || 0) > 0
            };
        });

        // SORT DESC BY RUNS
        const sortedPlayers = mappedPlayers.sort((a, b) => {
            const runsA = Number(a.runs.replace(/,/g, ""));
            const runsB = Number(b.runs.replace(/,/g, ""));
            return runsB - runsA;
        });

        // PAGINATION
        const topPlayers = sortedPlayers.slice(0, 4);

        const remainingPlayers = sortedPlayers.slice(4);

        const start = (page - 1) * limit;
        const end = page * limit;
        const leaderboard = remainingPlayers.slice(start, end);

        return { topPlayers, leaderboard };
    }
}
