import { createAsyncThunk } from "@reduxjs/toolkit";

import type { Message } from "./messageTypes";
import { createApiThunk } from "../../../../utils/createApiThunk";
import { messagesEndpoints } from "../../../../api/endpoints/chatEndpoints";

const normalizeMessages = (messages: Message[]): Message[] => messages.map((msg) => ({ ...msg, createdAt: new Date(msg.createdAt) }));

export const loadMessages = createAsyncThunk(
    "messages/loadMessages",
    createApiThunk(messagesEndpoints.fetchMessages, normalizeMessages)
);


export const loadMoreMessages = createAsyncThunk(
    "messages/loadMoreMessages",
    createApiThunk(messagesEndpoints.fetchMessages, normalizeMessages)
);


export const saveNewMessage = createAsyncThunk(
    "messages/saveMessage",
    createApiThunk(messagesEndpoints.saveNewMessage)
    
);