import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserTeams } from "./chatThunks";


type ChatState = {
    currentChatId: string | null;
    teams: any[] | null;
    typingUsers: Record<string, { id: string; name?: string }[]>;
    onlineByChat: Record<string, string[]>;
    loading: boolean,
    error: string | null;
};


const initialState: ChatState = {
    currentChatId: null,
    teams: [],
    typingUsers: {},
    onlineByChat: {},
    loading: false,
    error: null
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTeams.fulfilled, (state, action) => {
                state.teams = action.payload.teams;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });
    }
});


export const { setCurrentChat, setTypingUser, removeTypingUser } = chatSlice.actions;
export default chatSlice.reducer;