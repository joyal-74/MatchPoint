import { DashboardStats, IDashboardRepository } from "app/repositories/interfaces/admin/IDashboardRepository";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";
import { TournamentModel } from "infra/databases/mongo/models/TournamentModel";
import { TransactionModel } from "infra/databases/mongo/models/TransactionModel";
import { UserModel } from "infra/databases/mongo/models/UserModel";


export class DashboardRepository implements IDashboardRepository {
    async getDashboardStats(): Promise<DashboardStats> {

        // 1. Get Key Counts
        const totalRevenue = await TransactionModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const activePlayers = await UserModel.countDocuments({ role: 'player', isActive: true });
        console.log(activePlayers)
        const activeTournaments = await TournamentModel.countDocuments({ status: 'ongoing' });

        const totalTeams = await TeamModel.countDocuments({});
        // 2. Revenue Graph (Last 6 Months)
        const revenueGraph = await TransactionModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } },
            { $project: { name: { $toString: "$_id" }, revenue: "$total", _id: 0 } }
        ]);

        // 3. Daily Registrations (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const registrationGraph = await UserModel.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%m/%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", count: 1, _id: 0 } }
        ]);

        // 4. User Distribution
        const distribution = await UserModel.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            },
            { $project: { name: "$_id", value: "$count", _id: 0 } }
        ]);

        // 5. Recent Tournaments
        const recent = await TournamentModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title organizerId currTeams status");

        return {
            counts: {
                revenue: totalRevenue[0]?.total || 0,
                players: activePlayers,
                tournaments: activeTournaments,
                teams: totalTeams
            },
            revenueData: revenueGraph,
            registrationData: registrationGraph,
            userDistribution: distribution,
            recentTournaments: recent
        };
    }
}