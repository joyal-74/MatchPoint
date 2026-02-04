export interface DashboardStats {
    counts: {
        revenue: number;
        players: number;
        tournaments: number;
        teams: number;
    };
    revenueData: { name: string; revenue: number }[]; // Monthly
    registrationData: { date: string; count: number }[]; // Daily
    userDistribution: { name: string; value: number }[];
    recentTournaments: any[];
}

export interface IDashboardRepository {
    getDashboardStats(): Promise<DashboardStats>;
}
