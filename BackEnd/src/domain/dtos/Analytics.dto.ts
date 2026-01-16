export interface RevenueChartPoint {
    name: string;
    income: number;
    expense: number;
}

export interface FormatStatPoint {
    name: string; 
    value: number;
}

export interface TrafficPoint {
    day: string;
    teams: number;
}

export interface TopTournamentPoint {
    _id: string;
    title: string;
    status: string;
    volume: number;
    currTeams: number;
    maxTeams: number;
}

export interface DashboardAnalyticsDTO {
    revenueData: RevenueChartPoint[];
    formatData: FormatStatPoint[];
    trafficData: TrafficPoint[];
    topTournaments: TopTournamentPoint[];
}