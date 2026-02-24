import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useGroupChat } from "./useGroupChat";
import { getMyAllTeams, getMyTeamDetails } from "../../features/player/playerThunks";
import type { Team } from "../../components/player/Teams/Types";
import { toast } from "react-hot-toast";

interface TeamMember {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
}

export const useTeamChatLogic = ({ initialTeamId }: { initialTeamId?: string }) => {
    const dispatch = useAppDispatch();
    
    const currentUserId = useAppSelector((state) => state.auth.user?._id) || "me";
    const teams = useAppSelector((state) => state.player.approvedTeams);

    const [activeTeamId, setActiveTeamId] = useState<string | null>(initialTeamId || null);
    const [messageInput, setMessageInput] = useState("");
    const [isTypingLocal, setIsTypingLocal] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [replyingTo, setReplyingTo] = useState<any | null>(null);

    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(true);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastJoinedRoom = useRef<string | null>(null);

    const activeTeam = useMemo(
        () => teams.find((t) => t._id === activeTeamId) || null,
        [activeTeamId, teams]
    );

    const chat = useGroupChat({
        initialChatId: activeTeamId || undefined,
        autoJoin: true,
        onRemovedFromTeam: (teamId) => {
            if (activeTeamId === teamId) {
                setActiveTeamId(null);
                lastJoinedRoom.current = null;
                toast.error("You have been removed from this team.");
            }
            if (currentUserId !== "me") {
                dispatch(getMyAllTeams(currentUserId));
            }
        }
    });

    useEffect(() => {
        if (teams.length === 0 && currentUserId !== "me") {
            dispatch(getMyAllTeams(currentUserId));
        }
    }, [currentUserId, dispatch, teams.length]);

    useEffect(() => {
        if (activeTeamId && activeTeamId !== lastJoinedRoom.current) {
            chat.joinChat(activeTeamId);
            lastJoinedRoom.current = activeTeamId;
            setReplyingTo(null);
        }
    }, [activeTeamId, chat]);

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

    const sortedMessages = useMemo(() => {
        return [...chat.messages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [chat.messages]);

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

        const payload = replyingTo ? {
            text: messageInput,
            replyTo: {
                messageId: replyingTo.id || replyingTo._id,
                text: replyingTo.text,
                senderName: replyingTo.senderName
            }
        } : messageInput;

        chat.sendMessage(payload);
        setMessageInput("");
        setReplyingTo(null);
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
        replyingTo,
        chatStatus: {
            connected: chat.connected,
            loading: chat.loading,
            typingUsers: chat.typingUsers,
        },
        handlers: {
            handleSendMessage,
            handleInputChange,
            handleSelectTeam,
            setReplyingTo,
            toggleMembers: () => setShowMembers(p => !p),
            handleScroll: (e: React.UIEvent<HTMLDivElement>) => {
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100);
            },
            scrollToBottom: () => {
                messagesContainerRef.current?.scrollTo({ 
                    top: messagesContainerRef.current.scrollHeight, 
                    behavior: 'smooth' 
                });
            }
        },
        refs: { messagesContainerRef }
    };
};