import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    addMessage,
    deleteMessage,
    replaceOptimisticMessage
} from "../../features/player/Chat/messages/messagesSlice";
import type { ChatParticipantRole, Message } from "../../features/player/Chat/messages/messageTypes";
import { v4 as uuidv4 } from "uuid";
import { createSocket, getSocket } from "../../socket/socket";
import { loadMessages, loadMoreMessages } from "../../features/player/Chat/messages/messagesThunk";

type TypingEvent = {
    user: { id: string; name?: string };
    typing: boolean;
};

type MessagePayload = string | {
    text: string;
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
};

export function useGroupChat({
    initialChatId,
    autoJoin = false,
    onMessagesLoaded,
    onMoreMessagesLoaded,
    onRemovedFromTeam
}: {
    initialChatId?: string;
    autoJoin?: boolean;
    onMessagesLoaded?: (messages: Message[], isInitialLoad: boolean) => void;
    onMoreMessagesLoaded?: (messages: Message[]) => void;
    onRemovedFromTeam?: (teamId: string) => void;
}) {
    const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(null);
    const [connected, setConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ id: string; name?: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const { byChat, loading } = useAppSelector((state) => state.messages);
    const currentUser = useAppSelector((state) => state.auth.user);
    const currentUserId = currentUser?._id || "me";

    const currentChat = useRef<string | null>(initialChatId ?? null);
    const nextPageRef = useRef(2);
    const isMounted = useRef(true);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socketInitialized = useRef(false);
    const currentUserProfileImage = useAppSelector(state => state.auth.user?.profileImage);

    const messages = byChat[currentChat.current ?? ""] ?? [];

    const joinChat = useCallback((chatId: string) => {
        if (!socket || !connected) return;

        if (currentChat.current && currentChat.current !== chatId) {
            socket.emit("leave-room", { chatId: currentChat.current });
        }

        socket.emit("join-room", { chatId });
        currentChat.current = chatId;

        dispatch(loadMessages({ chatId })).then((action) => {
            if (loadMessages.fulfilled.match(action)) {
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

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        if (typing) {
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 3000);
        }

        socket.emit("typing", { chatId: currentChat.current, typing });
    }, [socket, connected]);

    const sendMessage = useCallback((payload: MessagePayload) => {
        const text = typeof payload === "string" ? payload : payload.text;
        const replyTo = typeof payload === "string" ? null : payload.replyTo;

        if (!socket || !connected || !currentChat.current || !text.trim()) {
            return false;
        }

        const rawRole = currentUser?.role;
        if (rawRole !== "player" && rawRole !== "manager") {
            console.error("Unauthorized: Only players and managers can send messages.");
            return false;
        }

        const senderRole = rawRole as ChatParticipantRole;

        const tempId = `temp-${uuidv4()}`;

        const optimisticMsg: Message = {
            id: tempId,
            chatId: currentChat.current,
            senderId: currentUserId,
            senderName: "You",
            senderRole,
            text,
            createdAt: new Date(),
            status: "pending",
            clientId: tempId,
            profileImage: currentUserProfileImage || '',
            replyTo: replyTo || undefined
        };

        dispatch(addMessage({
            chatId: currentChat.current,
            message: optimisticMsg
        }));

        socket.emit("send-message", {
            chatId: currentChat.current,
            text,
            clientId: tempId,
            profileImage: currentUserProfileImage || '',
            replyTo,
            senderRole
        });

        return true;
    }, [socket, connected, currentUserId, currentUser?.role, dispatch, currentUserProfileImage]);

    useEffect(() => {
        if (socketInitialized.current) return;

        socketInitialized.current = true;
        isMounted.current = true;

        let s = getSocket();
        if (!s) {
            s = createSocket();
            setSocket(s);
        } else {
            setSocket(s);
        }

        const handleConnect = () => {
            if (!isMounted.current) return;
            setConnected(true);
            setError(null);
            if (autoJoin && initialChatId && !currentChat.current) {
                joinChat(initialChatId);
            }
        };

        const handleDisconnect = () => {
            if (!isMounted.current) return;
            setConnected(false);
        };

        const handleReceiveMessage = (msg: Message & { clientId?: string }) => {
            if (!isMounted.current || msg.chatId !== currentChat.current) return;

            const updatedMsg = { ...msg, createdAt: new Date(msg.createdAt) };
            if (msg.senderId === currentUserId && msg.clientId) {
                dispatch(replaceOptimisticMessage({
                    chatId: msg.chatId,
                    clientId: msg.clientId,
                    finalMessage: updatedMsg
                }));
            } else {
                dispatch(addMessage({
                    chatId: msg.chatId,
                    message: updatedMsg
                }));
            }
        };

        const handleMessageError = ({ clientId, error }: { clientId: string; error: string }) => {
            if (!isMounted.current) return;

            console.warn("🚫 Message failed to send:", error);


            dispatch(deleteMessage({
                chatId: currentChat.current,
                clientId
            }));
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

        // --- NEW: KICK HANDLER ---
        const handleRemovedFromTeam = ({ teamId }: { teamId: string }) => {
            if (!isMounted.current) return;
            if (currentChat.current === teamId) {
                s.emit("leave-room", { chatId: teamId });
                currentChat.current = null;
            }
            onRemovedFromTeam?.(teamId);
        };

        s.on("connect", handleConnect);
        s.on("disconnect", handleDisconnect);
        s.on("receive-message", handleReceiveMessage);
        s.on("typing", handleTyping);
        s.on("removed-from-team", handleRemovedFromTeam);
        s.on("message-error", handleMessageError);

        if (s.connected) handleConnect();

        return () => {
            isMounted.current = false;
            socketInitialized.current = false;
            s.off("connect", handleConnect);
            s.off("disconnect", handleDisconnect);
            s.off("receive-message", handleReceiveMessage);
            s.off("typing", handleTyping);
            s.off("removed-from-team", handleRemovedFromTeam);
            s.off("message-error", handleMessageError);
        };
    }, [autoJoin, currentUserId, dispatch, initialChatId, joinChat, onRemovedFromTeam]);

    return {
        socket,
        connected,
        messages,
        typingUsers,
        currentChatId: currentChat.current,
        loading,
        error,
        joinChat,
        sendMessage,
        setTyping,
        loadMore
    };
}