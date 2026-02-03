import { MESSAGES_ROUTES } from "../../constants/routes/messagesRoutes";
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
};
