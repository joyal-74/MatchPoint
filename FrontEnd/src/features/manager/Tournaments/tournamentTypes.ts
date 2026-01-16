import type { Tournament } from "../managerTypes";

export interface AnalyticsData {
    revenueData: { name: string; income: number; expense: number }[];
    formatData: { name: string; value: number }[];
    trafficData: { day: string; teams: number }[];
    topTournaments: Partial<Tournament>[];
}

export interface PointsRow {
    _id: string;
    rank: number;
    team: string;
    teamLogo?: string;
    p: number;
    w: number;
    l: number;
    t: number;
    nrr: string;
    pts: number;
    form: string[];
}

export interface GroupData {
    groupName: string;
    rows: PointsRow[];
}

export interface PointsTableData {
    table?: PointsRow[];
    groups?: GroupData[];
}