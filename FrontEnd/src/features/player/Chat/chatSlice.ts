import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type ChatState = {
    currentChatId: string | null;
    typingUsers: Record<string, { id: string; name?: string }[]>;
    onlineByChat: Record<string, string[]>;
};


const initialState: ChatState = {
    currentChatId: null,
    typingUsers: {},
    onlineByChat: {},
};


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentChat(state, action: PayloadAction<string | null>) {
            state.currentChatId = action.payload;
        },
        setTypingUser(state, action: PayloadAction<{ chatId: string; user: { id: string; name?: string } | null }>) {
            const { chatId, user } = action.payload;
            if (!user) {
                state.typingUsers[chatId] = [];
                return;
            }
            state.typingUsers[chatId] = state.typingUsers[chatId] ?? [];
            if (!state.typingUsers[chatId].some((u) => u.id === user.id)) state.typingUsers[chatId].push(user);
        },
        removeTypingUser(state, action: PayloadAction<{ chatId: string; userId: string }>) {
            const { chatId, userId } = action.payload;
            state.typingUsers[chatId] = (state.typingUsers[chatId] ?? []).filter((u) => u.id !== userId);
        }
    }
});


export const { setCurrentChat, setTypingUser, removeTypingUser } = chatSlice.actions;
export default chatSlice.reducer;