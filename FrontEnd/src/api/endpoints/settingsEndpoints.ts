import { SETTINGS_ROUTES } from "../../constants/routes/settingsRoutes";
import axiosClient from "../http/axiosClient";

export const settingsEndpoints = {

    verifyCurrentPassword: async ({ userId, password }: { userId: string, password: string }): Promise<string> => {
        const { data } = await axiosClient.post(SETTINGS_ROUTES.VERIFY_PASSWORD, { userId, password });
        return data.data;
    },

    updatePassword: async ({ userId, currentPassword, newPassword }: { userId: string, currentPassword: string, newPassword: string }): Promise<string> => {
        const { data } = await axiosClient.patch(SETTINGS_ROUTES.UPDATE_PASSWORD, { userId, currentPassword, newPassword});
        return data.data;
    },

    updatePrivacy: async ({ userId, language, country }: { userId: string, language: string; country: string }): Promise<string> => {
        const { data } = await axiosClient.patch(SETTINGS_ROUTES.UPDATE_PRIVACY, { userId, language, country });
        return data.data;
    },
};