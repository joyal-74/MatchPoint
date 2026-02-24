import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "./messageTypes";
import { loadMessages, loadMoreMessages, saveNewMessage } from "./messagesThunk";

type MessagesState = {
    byChat: Record<string, Message[]>;
    loading: boolean;
    error: string | null;
};

const initialState: MessagesState = {
    byChat: {},
    loading: false,
    error: null,
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
            const { chatId, message } = action.payload;

            if (!state.byChat[chatId]) {
                state.byChat[chatId] = [];
            }

            // Check for existing message by clientId OR id
            const existingIndex = state.byChat[chatId].findIndex(
                m => m.clientId === message.clientId || m.id === message.id
            );

            if (existingIndex === -1) {
                state.byChat[chatId].push(message);
            } else {
                // Update existing message - merge properties but prefer new message data
                state.byChat[chatId][existingIndex] = {
                    ...state.byChat[chatId][existingIndex],
                    ...message,
                    // Ensure we keep the original clientId for optimistic messages
                    clientId: state.byChat[chatId][existingIndex].clientId || message.clientId
                };
            }
        },
        markMessageStatus: (state, action: PayloadAction<{
            chatId: string;
            clientId: string;
            status: Message['status'];
            id?: string;
            createdAt?: Date;
            text?: string;
        }>) => {
            const { chatId, clientId, status, id, createdAt, text } = action.payload;
            const chatMessages = state.byChat[chatId] || [];

            state.byChat[chatId] = chatMessages.map(msg => {
                if (msg.clientId === clientId) {
                    return {
                        ...msg,
                        status,
                        ...(id && { id }), // Only update id if provided
                        ...(createdAt && { createdAt }),
                        ...(text && { text })
                    };
                }
                return msg;
            });
        },
        // NEW: Specific action to replace optimistic message with final message
        replaceOptimisticMessage: (state, action: PayloadAction<{
            chatId: string;
            clientId: string;
            finalMessage: Message;
        }>) => {
            const { chatId, clientId, finalMessage } = action.payload;

            if (!state.byChat[chatId]) return;

            const existingIndex = state.byChat[chatId].findIndex(
                m => m.clientId === clientId
            );

            if (existingIndex !== -1) {
                // Replace the optimistic message completely with the final message
                // but preserve the clientId for tracking
                state.byChat[chatId][existingIndex] = {
                    ...finalMessage,
                    clientId 
                };
            }
        },

        deleteMessage: (state, action: PayloadAction<{ chatId: string | null; clientId: string }>) => {
            const { chatId, clientId } = action.payload;
            if (chatId && state.byChat[chatId]) {
                state.byChat[chatId] = state.byChat[chatId].filter(
                    (msg) => msg.clientId !== clientId
                );
            }
        },
        clearMessagesForChat(state, action: PayloadAction<string>) {
            delete state.byChat[action.payload];
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // loadMessages
            .addCase(loadMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMessages.fulfilled, (state, action) => {
                const { chatId } = action.meta.arg;
                state.byChat[chatId] = action.payload;
                state.loading = false;
            })
            .addCase(loadMessages.rejected, (state, action) => {
                state.error = action.payload as string ?? "Failed to load messages";
                state.loading = false;
            })
            // loadMoreMessages
            // loadMoreMessages
            .addCase(loadMoreMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMoreMessages.fulfilled, (state, action) => {
                const { chatId } = action.meta.arg;
                const existingMessages = state.byChat[chatId] ?? [];

                // Filter out duplicates when loading more
                const newMessages = action.payload.filter(
                    newMsg => !existingMessages.some(existingMsg =>
                        existingMsg.id === newMsg.id
                    )
                );

                state.byChat[chatId] = [...newMessages, ...existingMessages];
                state.loading = false;
            })
            .addCase(loadMoreMessages.rejected, (state, action) => {
                state.error = action.payload as string ?? "Failed to load more messages";
                state.loading = false;
            })
            // saveNewMessage - Handle the final message from backend
            .addCase(saveNewMessage.fulfilled, (state, action) => {
                const { chatId, message: optimisticMessage } = action.meta.arg;
                const finalMessage = action.payload;

                if (!state.byChat[chatId]) {
                    state.byChat[chatId] = [];
                }

                // Find and replace the optimistic message
                const existingIndex = state.byChat[chatId].findIndex(
                    m => m.clientId === optimisticMessage.clientId
                );

                if (existingIndex !== -1) {
                    // Complete replacement with final message data
                    state.byChat[chatId][existingIndex] = {
                        ...finalMessage,
                        clientId: optimisticMessage.clientId // Keep the connection
                    };
                } else {
                    // If no optimistic message found, add the final message
                    state.byChat[chatId].push(finalMessage);
                }

                state.loading = false;
            })
            .addCase(saveNewMessage.rejected, (state, action) => {
                state.error = action.payload as string ?? "Save failed";
                state.loading = false;

                // Mark optimistic message as failed
                const { chatId, message } = action.meta.arg;
                const chatMessages = state.byChat[chatId] || [];

                state.byChat[chatId] = chatMessages.map(msg =>
                    msg.clientId === message.clientId
                        ? { ...msg, status: "failed" }
                        : msg
                );
            });
    }
});

export const {
    addMessage,
    markMessageStatus,
    replaceOptimisticMessage,
    clearMessagesForChat,
    deleteMessage,
    clearError
} = messagesSlice.actions;
export default messagesSlice.reducer;