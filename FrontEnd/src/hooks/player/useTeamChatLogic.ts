import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useGroupChat } from "./useGroupChat";
import { getMyAllTeams, getMyTeamDetails } from "../../features/player/playerThunks";
import type { Team } from "../../components/player/Teams/Types"; 


interface TeamMember {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
}

interface UseTeamChatLogicProps {
    initialChatId?: string;
    initialTeamId?: string;
}

export const useTeamChatLogic = ({ initialChatId, initialTeamId }: UseTeamChatLogicProps) => {
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector((state) => state.auth.user?._id) || "me";
    const teams = useAppSelector((state) => state.player.approvedTeams);

    // Local UI State
    const [activeTeamId, setActiveTeamId] = useState<string | null>(initialTeamId || null);
    const [messageInput, setMessageInput] = useState("");
    const [isTypingLocal, setIsTypingLocal] = useState(false);

    // Panel States
    const [showMembers, setShowMembers] = useState(false);
    const [showTeamsMobile, setShowTeamsMobile] = useState(false); // Mobile toggle

    // Data States
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Scroll Logic State
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Derived State ---
    const activeTeam = useMemo(
        () => teams.find((t) => t._id === activeTeamId) || null,
        [activeTeamId, teams]
    );

    // --- External Hook Integration ---
    const chat = useGroupChat({
        initialChatId,
        autoJoin: true,
        onMessagesLoaded: (newMessages, isInitialLoad) => {
            if (isInitialLoad && newMessages.length < 20) setHasMoreMessages(false);
        },
        onMoreMessagesLoaded: (newMessages) => {
            if (newMessages.length < 20) setHasMoreMessages(false);
            setIsLoadingMore(false);
        }
    });

    // --- Side Effects ---

    // 1. Fetch Teams if missing
    useEffect(() => {
        if (teams.length === 0 && currentUserId) {
            dispatch(getMyAllTeams(currentUserId));
        }
    }, [teams.length, dispatch, currentUserId]);

    // 2. Join chat on mount or ID change
    useEffect(() => {
        if (initialChatId) chat.joinChat(initialChatId);
    }, [initialChatId, chat]);

    // 3. Auto-join active team chat if not manually joined
    useEffect(() => {
        if (activeTeamId && teams.length > 0 && !initialChatId && !chat.currentChatId) {
            chat.joinChat(activeTeamId);
        }
    }, [activeTeamId, teams.length, initialChatId, chat]);

    // 4. Fetch Members when panel opens
    useEffect(() => {
        if (showMembers && activeTeamId) {
            setLoadingMembers(true);
            dispatch(getMyTeamDetails(activeTeamId))
                .unwrap()
                .then((payload) => setMembers(payload.members || []))
                .catch(() => setMembers([]))
                .finally(() => setLoadingMembers(false));
        }
    }, [showMembers, activeTeamId, dispatch]);

    // 5. Scroll Management
    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (isNearBottom && !isLoadingMore) scrollToBottom();
    }, [chat.messages, isNearBottom, isLoadingMore, scrollToBottom]);

    // Reset scroll state on chat change
    useEffect(() => {
        setIsNearBottom(true);
        setIsLoadingMore(false);
        setHasMoreMessages(true);
    }, [chat.currentChatId]);

    // --- Handlers ---

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsNearBottom(distanceFromBottom <= 100);

        if (scrollTop < 50 && !isLoadingMore && hasMoreMessages && !chat.loading) {
            const prevHeight = scrollHeight;
            setIsLoadingMore(true);
            chat.loadMore().then(() => {
                // Restore scroll position
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        const newHeight = messagesContainerRef.current.scrollHeight;
                        messagesContainerRef.current.scrollTop = newHeight - prevHeight;
                    }
                }, 0);
            }).catch(() => setIsLoadingMore(false));
        }
    }, [isLoadingMore, hasMoreMessages, chat]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !chat.connected || !chat.currentChatId) return;

        chat.sendMessage(messageInput);
        setMessageInput("");
        setIsTypingLocal(false);
        chat.setTyping(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        if (!isTypingLocal) {
            setIsTypingLocal(true);
            chat.setTyping(true);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTypingLocal(false);
            chat.setTyping(false);
        }, 1000);
    };

    const handleSelectTeam = (team: Team) => {
        setActiveTeamId(team._id);
        if (chat.connected) chat.joinChat(team._id);
        setShowMembers(false);
        setShowTeamsMobile(false);
    };

    return {
        // Data
        currentUser: { id: currentUserId },
        teams,
        activeTeam,
        members,
        sortedMessages: [...chat.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),

        // UI State
        messageInput,
        isTypingLocal,
        showMembers,
        showTeamsMobile,
        loadingMembers,
        isNearBottom,
        isLoadingMore,
        hasMoreMessages,

        // Chat State (from hook)
        chatStatus: {
            connected: chat.connected,
            loading: chat.loading,
            error: chat.error,
            typingUsers: Array.from(chat.typingUsers),
        },

        // Handlers
        handlers: {
            setMessageInput,
            handleSendMessage,
            handleInputChange,
            handleSelectTeam,
            toggleMembers: () => setShowMembers(prev => !prev),
            toggleTeamsMobile: () => setShowTeamsMobile(prev => !prev),
            handleScroll,
            scrollToBottom
        },

        // Refs
        refs: {
            inputRef,
            messagesContainerRef
        }
    };
};