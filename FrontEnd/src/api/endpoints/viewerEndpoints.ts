import axiosClient from "../http/axiosClient";
import type { User } from "../../types/User";
import { VIEWER_ROUTES } from "../../constants/viewerRoutes";
import type { UpdateUserDataPayload } from "../../features/manager/managerTypes";

export const viewerEndpoints = {
    fetchViewerData: async (playerId: string): Promise<User> => {
        const { data } = await axiosClient.get(VIEWER_ROUTES.GET_DETAILS(playerId));
        return data.data;
    },

    updatePlayerData: async ({ userData, userId }: UpdateUserDataPayload): Promise<User> => {
        const { data } = await axiosClient.put(VIEWER_ROUTES.EDIT_DETAILS(userId),
            userData, { headers: { "Content-Type": "multipart/form-data" }, }
        );
        return data.data;
    },
};