import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    addMessage,
    replaceOptimisticMessage
} from "../../features/player/Chat/messages/messagesSlice";
import type { Message } from "../../features/player/Chat/messages/messageTypes";
import { v4 as uuidv4 } from "uuid";
import { createSocket, getSocket } from "../../socket/socket";
import { loadMessages, loadMoreMessages } from "../../features/player/Chat/messages/messagesThunk";

type TypingEvent = {
    user: { id: string; name?: string };
    typing: boolean;
};

export function useGroupChat({
    initialChatId,
    autoJoin = false,
    onMessagesLoaded,
    onMoreMessagesLoaded
}: {
    initialChatId?: string;
    autoJoin?: boolean;
    onMessagesLoaded?: (messages: Message[], isInitialLoad: boolean) => void;
    onMoreMessagesLoaded?: (messages: Message[]) => void;
}) {
    const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(null);
    const [connected, setConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ id: string; name?: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const { byChat, loading } = useAppSelector((state) => state.messages);
    const currentUserId = useAppSelector((state) => state.auth.user?._id || "me");

    const currentChat = useRef<string | null>(initialChatId ?? null);
    const nextPageRef = useRef(2);
    const isMounted = useRef(true);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socketInitialized = useRef(false); // Add this ref
    const currentUserProfileImage = useAppSelector(state => state.auth.user?.profileImage);

    // Get messages for current chat
    const messages = byChat[currentChat.current ?? ""] ?? [];

    const joinChat = useCallback((chatId: string) => {
        console.log("🔄 joinChat called with:", chatId);
        console.log("📡 Socket connected:", connected);
        console.log("💬 Current chat:", currentChat.current);

        if (!socket || !connected) {
            console.log("❌ Cannot join: socket not ready");
            return;
        }

        if (currentChat.current && currentChat.current !== chatId) {
            console.log("🚪 Leaving previous room:", currentChat.current);
            socket.emit("leave-room", { chatId: currentChat.current });
        }

        console.log("🚀 Joining room:", chatId);
        socket.emit("join-room", { chatId });
        currentChat.current = chatId;

        dispatch(loadMessages({ chatId })).then((action) => {
            if (loadMessages.fulfilled.match(action)) {
                console.log("✅ Messages loaded for chat:", chatId);
                onMessagesLoaded?.(action.payload, true);
            }
        });
    }, [socket, connected, dispatch, onMessagesLoaded]);

    const loadMore = useCallback(() => {
        if (!currentChat.current || !connected || loading) {
            return Promise.resolve();
        }

        return dispatch(loadMoreMessages({ chatId: currentChat.current, page: nextPageRef.current })).then((action) => {
            if (loadMoreMessages.fulfilled.match(action)) {
                nextPageRef.current += 1;
                onMoreMessagesLoaded?.(action.payload);
            }
            return action;
        });
    }, [connected, dispatch, loading, onMoreMessagesLoaded]);

    const setTyping = useCallback((typing: boolean) => {
        if (!socket || !connected || !currentChat.current) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (typing) {
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 3000);
        }

        socket.emit("typing", { chatId: currentChat.current, typing });
    }, [socket, connected]);

    const sendMessage = useCallback((text: string) => {
        console.log('📤 sendMessage called with:', { text, connected, currentChat: currentChat.current, socket: !!socket });

        if (!socket || !connected || !currentChat.current || !text.trim()) {
            console.log("❌ Cannot send message: conditions not met");
            return false;
        }

        const tempId = `temp-${uuidv4()}`;
        
        const optimisticMsg: Message = {
            id: tempId,
            chatId: currentChat.current,
            senderId: currentUserId,
            senderName: "You",
            text,
            createdAt: new Date(),
            status: "pending",
            clientId: tempId,
            profileImage : currentUserProfileImage || ''
        };

        console.log('➕ Adding optimistic message:', optimisticMsg);

        dispatch(addMessage({
            chatId: currentChat.current,
            message: optimisticMsg
        }));


        socket.emit("send-message", { chatId: currentChat.current, text, clientId: tempId, profileImage: currentUserProfileImage || '' });
        console.log('📡 Message emitted via socket');

        return true;
    }, [socket, connected, currentUserId, dispatch, currentUserProfileImage]);

    // Debug effect to track state changes
    useEffect(() => {
        console.log("🎯 useGroupChat state changed", {
            connected,
            currentChatId: currentChat.current,
            socketId: socket?.id,
            messagesCount: messages.length
        });
    }, [connected, socket, messages.length]);

    // Main socket effect - RUN ONCE
    useEffect(() => {
        // Prevent double initialization in Strict Mode
        if (socketInitialized.current) {
            console.log("⚡ Socket already initialized, skipping");
            return;
        }

        socketInitialized.current = true;
        isMounted.current = true;
        console.log("🔌 Setting up socket connection");

        let s = getSocket();
        if (!s) {
            s = createSocket();
            setSocket(s);
            console.log("🆕 Created new socket");
        } else {
            setSocket(s);
            console.log("🔁 Reusing existing socket");
        }

        const handleConnect = () => {
            if (!isMounted.current) return;
            console.log("✅ Socket connected:", s?.id);
            setConnected(true);
            setError(null);
            if (autoJoin && initialChatId && !currentChat.current) {
                console.log("🔗 Auto-joining initial chat on connect:", initialChatId);
                joinChat(initialChatId);
            }
        };

        const handleDisconnect = () => {
            if (!isMounted.current) return;
            console.log("❌ Socket disconnected");
            setConnected(false);
        };

        const handleConnectError = (err: Error) => {
            if (!isMounted.current) return;
            console.error("💥 Socket connection error:", err);
            setError(`Connection failed: ${err.message}`);
        };

        const handleReceiveMessage = (msg: Message & { clientId?: string }) => {
            if (!isMounted.current) return;

            console.log('📨 Received message via socket:', msg);

            if (msg.chatId !== currentChat.current) {
                console.log('⚠️ Message for different chat, ignoring');
                return;
            }

            const updatedMsg = { ...msg, createdAt: new Date(msg.createdAt) };
            console.log('✅ Processing message:', updatedMsg);

            if (msg.senderId === currentUserId && msg.clientId) {
                console.log('🔄 Replacing optimistic message with final message:', msg.clientId);
                dispatch(replaceOptimisticMessage({
                    chatId: msg.chatId,
                    clientId: msg.clientId,
                    finalMessage: updatedMsg
                }));
            } else {
                console.log('➕ Adding message from other user');
                dispatch(addMessage({
                    chatId: msg.chatId,
                    message: updatedMsg
                }));
            }
        };

        const handleTyping = ({ user, typing }: TypingEvent) => {
            if (!isMounted.current) return;

            setTypingUsers(prev => {
                if (typing) {
                    return [...prev.filter(u => u.id !== user.id), { id: user.id, name: user.name }];
                } else {
                    return prev.filter(u => u.id !== user.id);
                }
            });
        };


        // Event listeners
        s.on("connect", handleConnect);
        s.on("disconnect", handleDisconnect);
        s.on("connect_error", handleConnectError);
        s.on("receive-message", handleReceiveMessage);
        s.on("typing", handleTyping);

        const handleReconnect = () => {
            console.log("🔁 Socket reconnected");
            handleConnect();
        };

        const handleReconnectError = () => {
            if (!isMounted.current) return;
            console.error("💥 Socket reconnection failed");
            setConnected(false);
            setError("Reconnection failed");
        };

        s.on("reconnect", handleReconnect);
        s.on("reconnect_error", handleReconnectError);

        // If socket is already connected, trigger connect handler
        if (s.connected) {
            console.log("✅ Socket already connected, triggering handler");
            handleConnect();
        }

        return () => {
            console.log("🧹 Cleaning up socket effect");
            isMounted.current = false;
            socketInitialized.current = false; // Reset for next mount

            // Remove all event listeners
            s.off("connect", handleConnect);
            s.off("disconnect", handleDisconnect);
            s.off("connect_error", handleConnectError);
            s.off("receive-message", handleReceiveMessage);
            s.off("typing", handleTyping);
            s.off("reconnect", handleReconnect);
            s.off("reconnect_error", handleReconnectError);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [autoJoin, currentUserId, dispatch, initialChatId, joinChat])

    useEffect(() => {
        return () => {
            console.log("🧹 useGroupChat unmounting completely");
            if (currentChat.current && socket?.connected) {
                console.log("🚪 Leaving room on unmount:", currentChat.current);
                socket.emit("leave-room", { chatId: currentChat.current });
            }
        };
    }, [socket]);

    return {
        socket,
        connected,
        messages: messages,
        typingUsers: Array.from(typingUsers),
        currentChatId: currentChat.current,
        loading,
        error,
        joinChat,
        sendMessage,
        setTyping,
        loadMore
    };
}