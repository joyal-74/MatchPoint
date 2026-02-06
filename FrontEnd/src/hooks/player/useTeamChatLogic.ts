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

export const useTeamChatLogic = ({ initialTeamId }: { initialTeamId?: string }) => {
    const dispatch = useAppDispatch();
    
    // Selectors
    const currentUserId = useAppSelector((state) => state.auth.user?._id) || "me";
    const teams = useAppSelector((state) => state.player.approvedTeams);

    // UI State
    const [activeTeamId, setActiveTeamId] = useState<string | null>(initialTeamId || null);
    const [messageInput, setMessageInput] = useState("");
    const [isTypingLocal, setIsTypingLocal] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    
    // Data States
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(true);

    // Refs
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const lastJoinedRoom = useRef<string | null>(null);

    // Derived State
    const activeTeam = useMemo(
        () => teams.find((t) => t._id === activeTeamId) || null,
        [activeTeamId, teams]
    );

    // Socket Integration
    const chat = useGroupChat({
        initialChatId: activeTeamId || undefined,
        autoJoin: true
    });

    // 1. Fetch Teams (Mount Only)
    useEffect(() => {
        if (teams.length === 0 && currentUserId !== "me") {
            dispatch(getMyAllTeams(currentUserId));
        }
    }, [currentUserId, dispatch]);

    // 2. Room Join Logic (Gatekept by Ref to stop loops)
    useEffect(() => {
        if (activeTeamId && activeTeamId !== lastJoinedRoom.current) {
            chat.joinChat(activeTeamId);
            lastJoinedRoom.current = activeTeamId;
        }
    }, [activeTeamId]);

    // 3. Fetch Members
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

    // 4. Message Sorting (Fixes Redux Serialization Date Error)
    const sortedMessages = useMemo(() => {
        return [...chat.messages].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
        });
    }, [chat.messages]);

    // Handlers
    const handleSelectTeam = useCallback((team: Team | null) => {
        if (!team) {
            setActiveTeamId(null);
            lastJoinedRoom.current = null;
            return;
        }
        setActiveTeamId(team._id);
        setShowMembers(false);
    }, []);

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
        }, 2000);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !chat.connected) return;
        chat.sendMessage(messageInput);
        setMessageInput("");
    };

    return {
        currentUser: { id: currentUserId },
        teams,
        activeTeam,
        members,
        sortedMessages,
        messageInput,
        showMembers,
        loadingMembers,
        isNearBottom,
        chatStatus: {
            connected: chat.connected,
            loading: chat.loading,
            typingUsers: Array.from(chat.typingUsers),
        },
        handlers: {
            handleSendMessage,
            handleInputChange,
            handleSelectTeam,
            toggleMembers: () => setShowMembers(p => !p),
            handleScroll: (e: React.UIEvent<HTMLDivElement>) => {
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100);
            },
            scrollToBottom: () => {
                messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
            }
        },
        refs: { messagesContainerRef }
    };
};