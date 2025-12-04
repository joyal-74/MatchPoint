import { LEADERBOARD_ROUTES } from "../../constants/routes/leaderboardRoutes";
import type { LeaderboardRow, TopPlayerStats } from "../../features/shared/leaderboard/leaderboardTypes";
import axiosClient from "../http/axiosClient";

type LeaderBoardProps = {
    position: string;
    search: string;
    page: string;
    limit: string
}

export interface LeaderBoardResponse {
    topPlayers: TopPlayerStats[];
    leaderboard: LeaderboardRow[];
}

export const leaderboardEndpoints = {
    fetchLeaderboardData: async (filters: LeaderBoardProps): Promise<LeaderBoardResponse> => {
        const { data } = await axiosClient.get(LEADERBOARD_ROUTES.GET_DETAILS, { params: filters });
        return data.data;
    },
}