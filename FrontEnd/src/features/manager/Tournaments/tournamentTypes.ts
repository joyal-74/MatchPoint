import type { Tournament } from "../managerTypes";

export interface AnalyticsData {
    revenueData: { name: string; income: number; expense: number }[];
    formatData: { name: string; value: number }[];
    trafficData: { day: string; teams: number }[];
    topTournaments: Partial<Tournament>[];
}