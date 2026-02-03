import axios from "axios";
import type { Message } from "../../features/player/Chat/messages/messageTypes";

const BASE = import.meta.env.VITE_SERVER_URL ?? "/api";

export async function fetchMessages(chatId: string, token?: string, page = 1, pageSize = 50): Promise<Message[]> {
    const res = await axios.get(`${BASE}/api/chat/${chatId}/messages`, {
        params: { page, pageSize },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return res.data?.data ?? [];
}