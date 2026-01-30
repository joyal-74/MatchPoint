import axiosClient from "../http/axiosClient";
import type { User } from "../../types/User";
import { VIEWER_ROUTES } from "../../constants/routes/viewerRoutes";
import type { UpdateUserDataPayload } from "../../features/manager/managerTypes";
import type { MatchDetails } from "../../features/viewer/viewerTypes";
import type { Match } from "../../domain/match/types";

export const viewerEndpoints = {
    fetchViewerData: async (viewerId: string): Promise<User> => {
        const { data } = await axiosClient.get(VIEWER_ROUTES.GET_DETAILS(viewerId));
        return data.data;
    },

    fetchLiveMatches: async (viewerId: string): Promise<Match[]> => {
        const { data } = await axiosClient.get(VIEWER_ROUTES.GET_LIVE_MATCHES(viewerId));
        return data.data;
    },

    fetchMatchUpdates: async (matchId: string): Promise<MatchDetails[]> => {
        const { data } = await axiosClient.get(VIEWER_ROUTES.FETCH_MATCH_UPDATES(matchId));
        return data.data;
    },

    updateViewerData: async ({ userData, userId }: UpdateUserDataPayload): Promise<User> => {
        const { data } = await axiosClient.put(VIEWER_ROUTES.EDIT_DETAILS(userId),
            userData, { headers: { "Content-Type": "multipart/form-data" }, }
        );
        return data.data;
    },

    fetchTournaments: async (filters?: { status?: string; page?: number; limit?: number; playerId?: string }) => {
        const { status, page = 1, limit = 10, playerId } = filters || {};
        const { data } = await axiosClient.get(VIEWER_ROUTES.GET_TOURNAMENTS, {
            params: { status, page, limit, playerId }
        });

        return data.data;
    },
};