import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { ITransactionRepository } from "app/repositories/interfaces/shared/ITransactionRepository";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { IWalletRepository } from "app/repositories/interfaces/shared/IWalletRepository";
import { DashboardAnalyticsDTO, TrafficPoint } from "domain/dtos/Analytics.dto";
import { IGetDashboardAnalytics } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";

@injectable()
export class GetDashboardAnalytics implements IGetDashboardAnalytics {
    constructor(
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.TransactionRepository) private _transactionRepo: ITransactionRepository,
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.RegistrationRepository) private _teamRepo: IRegistrationRepository,
    ) { }

    async execute(managerId: string): Promise<DashboardAnalyticsDTO> {
        // 1. Start fetching independent data immediately
        const walletPromise = this._walletRepo.getByOwner(managerId, 'USER');
        const tournamentIdsPromise = this._tournamentRepo.getIdsByManager(managerId);

        // These depend only on managerId, so start them now too
        const formatPromise = this._tournamentRepo.getFormatDistribution(managerId);
        const topPromise = this._tournamentRepo.getTopPerforming(managerId, 5);

        // 2. Await the prerequisites
        const [wallet, tournamentIds] = await Promise.all([
            walletPromise,
            tournamentIdsPromise
        ]);

        if (!wallet) throw new Error("Manager wallet not found");

        // 3. Now fetch dependent data
        // Revenue needs Wallet ID
        const revenuePromise = this._transactionRepo.getMonthlyStats(wallet.id, 6);

        // Traffic needs Tournament IDs
        let trafficPromise: Promise<TrafficPoint[]> = Promise.resolve([]);
        if (tournamentIds.length > 0) {
            // Cast string[] if your repo expects ObjectIds, otherwise pass generic strings
            trafficPromise = this._teamRepo.getDailyRegistrations(tournamentIds, 7);
        }

        // 4. Wait for the final results
        const [revenueRaw, trafficRaw, formatData, topTournaments] = await Promise.all([
            revenuePromise,
            trafficPromise,
            formatPromise,
            topPromise
        ]);

        // 5. Map and Return
        return {
            revenueData: this.mapRevenueData(revenueRaw),
            formatData,
            trafficData: this.mapTrafficData(trafficRaw),
            topTournaments
        };
    }

    // Helper: Maps Mongo Aggregation result (Month numbers) to Chart labels ("Jan")
    private mapRevenueData(data: any[]) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return data.map(item => ({
            name: months[item._id.month - 1],
            income: item.income,
            expense: item.expense
        }));
    }

    // Helper: Fills in missing days with 0 for the chart
    private mapTrafficData(data: any[]) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { day: days[d.getDay()], teams: 0, rawDay: d.getDay() + 1 };
        });

        data.forEach(item => {
            const match = last7Days.find(d => d.rawDay === item._id);
            if (match) match.teams = item.teams;
        });

        return last7Days.map(({ day, teams }) => ({ day, teams }));
    }
}