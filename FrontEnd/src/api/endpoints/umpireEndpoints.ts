import { UMPIRE_ROUTES } from "../../constants/routes/umpireRoutes";
import type { User } from "../../types/User";
import axiosClient from "../http/axiosClient";

export const umpireEndpoints = {
    fetchUmpireData: async (umpireId: string): Promise<User> => {
        const { data } = await axiosClient.get(UMPIRE_ROUTES.GET_DETAILS(umpireId));
        return data.data;
    },

    updateUmpireData: async ({ userData, userId }: { userData: FormData; userId: string }): Promise<User> => {
        const { data } = await axiosClient.put(UMPIRE_ROUTES.EDIT_DETAILS(userId),
            userData);

        return data.data;
    },

}