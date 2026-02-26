import { MESSAGES_ROUTES } from "../../constants/routes/messagesRoutes";
import type { Team } from "../../domain/match/types";
import type { Message } from "../../features/player/Chat/messages/messageTypes";
import axiosClient from "../http/axiosClient";

export const messagesEndpoints = {
    fetchMessages: async (params: { chatId: string; page?: number; pageSize?: number }): Promise<Message[]> => {
        const { chatId, page = 1, pageSize = 50 } = params;
        const { data } = await axiosClient.get(MESSAGES_ROUTES.GET_MESSAGES(chatId), {
            params: { page, pageSize },
        });
        return data?.data ?? [];
    },

    saveNewMessage: async ({ chatId, message }: { chatId: string, message: Message }): Promise<Message> => {
        const { data } = await axiosClient.post(MESSAGES_ROUTES.SAVE_MESSAGES(chatId), message);
        return data.data;
    },

    getUserTeams: async ({ userId, role }: { userId: string, role: string }): Promise<{ teams: Team[], totalTeams: number }> => {
        const { data } = await axiosClient.get(MESSAGES_ROUTES.GET_USER_TEAMS(userId, role));
        return data.data;
    },

    getTeamDetails: async (teamId: string): Promise<Team> => {
        const { data } = await axiosClient.get(MESSAGES_ROUTES.GET_MY_TEAM(teamId))
        return data.data;
    },
};
