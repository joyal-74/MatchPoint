import axiosClient from "../http/axiosClient";
import type { User } from "../../types/User";
import { VIEWER_ROUTES } from "../../constants/viewerRoutes";

export const viewerEndpoints = {
    fetchViewerData: async (playerId: string): Promise<User> => {
        const { data } = await axiosClient.get(VIEWER_ROUTES.GET_DETAILS(playerId));
        return data.data;
    },

    updateViewerData: async (userData: User): Promise<User> => {
        const { data } = await axiosClient.put(VIEWER_ROUTES.EDIT_DETAILS(userData._id));
        return data.data;
    },
};