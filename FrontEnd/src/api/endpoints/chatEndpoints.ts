import type { Message } from "../../features/player/Chat/messages/messageTypes";
import axiosClient from "../http/axiosClient";


const BASE = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

export const messagesEndpoints = {
    fetchMessages: async (params: { chatId: string; page?: number; pageSize?: number }): Promise<Message[]> => {
        const { chatId, page = 1, pageSize = 50 } = params;
        const { data } = await axiosClient.get(`${BASE}/chat/${chatId}/messages`, {
            params: { page, pageSize },
        });
        return data?.data ?? [];
    },

    saveNewMessage: async ({ chatId, message }: { chatId: string, message: Message }): Promise<Message> => {
        console.log('hii')
        const { data } = await axiosClient.post(`${BASE}/chat/${chatId}/messages`, message);
        console.log(data.data)
        return data.data;
    },
};
