import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Send, Paperclip, Users, X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useGroupChat } from "../../../hooks/player/useGroupChat";
import type { Message } from "../../../features/player/Chat/messages/messageTypes";
import { getMyAllTeams, getMyTeamDetails } from "../../../features/player/playerThunks";
import type { Team } from "../../../components/player/Teams/Types";
import PlayerLayoutNavbar from "../../layout/PlayerLayoutWithNavbar";

interface TeamChatProps {
    initialChatId?: string;
    initialTeamId?: string;
}

interface TeamMember {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
}

export default function TeamChat({ initialChatId, initialTeamId }: TeamChatProps) {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [activeTeamId, setActiveTeamId] = useState<string | null>(initialTeamId || null);
    const [showTeams, setShowTeams] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    // Scroll management state
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const dispatch = useAppDispatch();
    const teams = useAppSelector((state) => state.player.approvedTeams);
    const currentUserId = useAppSelector((state) => state.auth.user?._id) || "me";

    useEffect(() => {
        if (teams.length === 0 && currentUserId) {
            dispatch(getMyAllTeams(currentUserId));
        }
    }, [teams, dispatch, currentUserId]);

    const activeTeam = useMemo(
        () => teams.find((t) => t._id === activeTeamId) || null,
        [activeTeamId, teams]
    );

    const {
        connected,
        messages,
        typingUsers,
        loading,
        error,
        joinChat,
        sendMessage,
        setTyping,
        loadMore,
        currentChatId
    } = useGroupChat({
        initialChatId,
        autoJoin: true,
        onMessagesLoaded: (newMessages, isInitialLoad) => {
            if (isInitialLoad && newMessages.length < 20) {
                setHasMoreMessages(false);
            }
        },
        onMoreMessagesLoaded: (newMessages) => {
            if (newMessages.length < 20) {
                setHasMoreMessages(false);
            }
            setIsLoadingMore(false);
        }
    });

    useEffect(() => {
        if (!initialChatId) return;
        joinChat(initialChatId);
    }, [initialChatId, joinChat]);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsNearBottom(distanceFromBottom <= 100);
        if (scrollTop < 50 && !isLoadingMore && hasMoreMessages && !loading) {
            const previousScrollHeight = scrollHeight;
            setIsLoadingMore(true);
            loadMore().then(() => {
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight;
                        const heightDifference = newScrollHeight - previousScrollHeight;
                        messagesContainerRef.current.scrollTop = heightDifference;
                    }
                }, 0);
            }).catch(() => {
                setIsLoadingMore(false);
            });
        }
    }, [isLoadingMore, hasMoreMessages, loading, loadMore]);

    useEffect(() => {
        if (isNearBottom && !isLoadingMore) {
            scrollToBottom();
        }
    }, [messages, isNearBottom, isLoadingMore, scrollToBottom]);

    useEffect(() => {
        setIsNearBottom(true);
        setIsLoadingMore(false);
        setHasMoreMessages(true);
    }, [currentChatId]);

    useEffect(() => {
        if (activeTeamId && teams.length > 0 && !initialChatId && !currentChatId) {
            joinChat(activeTeamId);
        }
    }, [activeTeamId, teams.length, initialChatId, currentChatId, joinChat]);

    const fetchTeamMembers = useCallback(async (teamId: string) => {
        if (!teamId) return;
        setLoadingMembers(true);
        try {
            const result = await dispatch(getMyTeamDetails(teamId));
            if (getMyTeamDetails.fulfilled.match(result)) {
                setMembers(result.payload.members || []);
            } else {
                console.error("Failed to fetch team members");
                setMembers([]);
            }
        } catch (error) {
            console.error("Error fetching team members:", error);
            setMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (showMembers && activeTeamId) {
            fetchTeamMembers(activeTeamId);
        }
    }, [showMembers, activeTeamId, fetchTeamMembers]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !connected || !currentChatId) return;
        sendMessage(message);
        setMessage("");
        setIsTyping(false);
        setTyping(false);
    };

    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
            setTyping(true); // Emit typing true
        }
        // Clear previous timeout
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        // Start new timeout
        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
            setTyping(false); // Emit typing false
        }, 1000);
    };

    const handleTeamSelect = (team: Team) => {
        console.log("👆 Team selected:", team._id);
        setActiveTeamId(team._id);
        if (connected) {
            joinChat(team._id);
        } else {
            console.log("⚠️ Socket not connected, cannot join chat");
        }
        setShowMembers(false);
        setMembers([]);
    };

    useEffect(() => {
        if (connected && activeTeamId && !currentChatId) {
            console.log("🔗 Socket connected, joining team chat:", activeTeamId);
            joinChat(activeTeamId);
        }
    }, [connected, activeTeamId, currentChatId, joinChat]);

    const toggleMembersPanel = () => {
        setShowMembers(!showMembers);
        if (showMembers) {
            setMembers([]);
        }
    };

    const handleScrollToBottom = () => {
        setIsNearBottom(true);
        scrollToBottom();
    };

    const sortedMessages = useMemo(() => {
        return [...messages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [messages]);
    console.log(sortedMessages)

    const typingUsersArray = Array.from(typingUsers);

    const typingIndicator = typingUsersArray.length > 0
        ? `${typingUsersArray[0]?.name || "Someone"} is typing...`
        : null;

    const EmptyChatSVG = () => (
        <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 opacity-60"
        >
            <path
                d="M50 70C50 67.2386 52.2386 65 55 65H145C147.761 65 150 67.2386 150 70V130C150 132.761 147.761 135 145 135H55C52.2386 135 50 132.761 50 130V70Z"
                fill="#374151"
                stroke="#6B7280"
                strokeWidth="2"
            />
            <path
                d="M60 80H140"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M60 95H120"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M60 110H100"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle
                cx="160"
                cy="100"
                r="15"
                fill="#10B981"
                stroke="#059669"
                strokeWidth="2"
            />
            <path
                d="M155 100L158 103L165 96"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );

    return (
        <PlayerLayoutNavbar>
            <div className="w-full min-h-[680px] max-h-[650px] text-white flex flex-col lg:flex-row gap-0 lg:gap-4 py-5 mx-auto">
                {/* COLLAPSIBLE TEAMS PANEL - TOP ON MOBILE, LEFT ON DESKTOP */}
                <div className="bg-neutral-900 lg:bg-neutral-950 w-full lg:w-72 rounded-xl p-4 lg:rounded-none lg:border-r lg:border-neutral-800 order-1 lg:order-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">My Teams</h2>
                        <button
                            onClick={() => setShowTeams(!showTeams)}
                            className="lg:hidden p-1 rounded-md hover:bg-[#1f2022]"
                        >
                            {showTeams ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                    {showTeams && (
                        <>
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    placeholder="Search teams..."
                                    className="bg-[#0e0e0f] w-full pl-10 pr-4 py-2 rounded-md text-sm outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm max-h-80 overflow-y-auto">
                                {teams.map((team) => (
                                    <button
                                        key={team._id}
                                        onClick={() => handleTeamSelect(team)}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTeamId === team._id
                                            ? "bg-green-700 text-white shadow-md"
                                            : "hover:bg-[#1f2022] text-gray-300"}`}
                                    >
                                        {team?.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-600 rounded-full flex-shrink-0"></div>
                                        )}
                                        <span className="truncate flex-1 text-left">{team.name}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    {!connected && <p className="text-yellow-400 text-xs mt-2">Connecting...</p>}
                </div>

                {/* MAIN CHAT AREA - FLEXIBLE */}
                <div className={`bg-neutral-900 lg:bg-neutral-950 rounded-xl flex flex-col w-full ${showMembers ? 'lg:flex-1' : 'flex-1'} order-2 lg:order-2`}>
                    {/* HEADER - MORE COMPACT WITH STATUS BADGE */}
                    <div className="p-3 lg:p-4 flex items-center gap-3 border-b border-neutral-800">
                        {activeTeam?.logo ? (
                            <div className="relative">
                                <img
                                    src={activeTeam.logo}
                                    alt={activeTeam.name}
                                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 ${connected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                        ) : (
                            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gray-600 rounded-full relative">
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-900 ${connected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold truncate text-base lg:text-lg">{activeTeam?.name || "Select a Team"}</h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {typingIndicator && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/50 rounded-full text-xs text-green-300">
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                        {typingIndicator}
                                    </span>
                                )}
                                {isLoadingMore && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/50 rounded-full text-xs text-blue-300">
                                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                        Loading older...
                                    </span>
                                )}
                                {!isNearBottom && activeTeam && (
                                    <button
                                        onClick={handleScrollToBottom}
                                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                                    >
                                        <ChevronDown size={12} /> Bottom
                                    </button>
                                )}
                            </div>
                        </div>
                        {activeTeam && (
                            <button
                                onClick={toggleMembersPanel}
                                className={`p-2 rounded-lg transition-colors ${showMembers ? "bg-green-700" : "hover:bg-[#2d2e32]"}`}
                            >
                                <Users size={18} />
                            </button>
                        )}
                    </div>

                    {/* MESSAGES OR EMPTY STATE */}
                    {activeTeam ? (
                        <>
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 p-3 lg:p-4 overflow-y-auto flex flex-col gap-4 scrollbar-hide bg-gradient-to-b from-neutral-900/50 to-neutral-950/50"
                                onScroll={handleScroll}
                            >
                                {isLoadingMore && (
                                    <div className="flex justify-center py-3">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            Loading older messages...
                                        </div>
                                    </div>
                                )}
                                {!hasMoreMessages && messages.length > 0 && (
                                    <div className="text-center py-3">
                                        <p className="text-gray-500 text-sm italic">You've reached the earliest messages</p>
                                    </div>
                                )}
                                {loading && !isLoadingMore && (
                                    <div className="flex justify-center py-8">
                                        <div className="text-center">
                                            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            <p className="text-gray-400">Loading messages...</p>
                                        </div>
                                    </div>
                                )}
                                {sortedMessages.map((m: Message) => {
                                    const isMine = m.senderId === currentUserId;
                                    const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <div
                                            key={m.id || m.clientId}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"} w-full`}
                                        >
                                            <div className={`max-w-[80%] lg:max-w-[70%] flex flex-col ${isMine ? "" : "items-start"}`}>
                                                {!isMine && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden bg-gray-600 text-xs font-medium">
                                                            {m.profileImage ? (
                                                                <img
                                                                    src={m.profileImage}
                                                                    alt={m.senderName || "User"}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-white">
                                                                    {m.senderName?.[0]?.toUpperCase() || "?"}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-xs text-gray-400">{m.senderName}</span>
                                                        <span className="text-xs text-gray-500">• {time}</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={`relative px-4 py-2 rounded-xl text-sm shadow-lg ${isMine
                                                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white ml-auto rounded-br-sm"
                                                        : "bg-[#2d2e32] text-gray-100 rounded-tl-sm"} 
                                                        ${m.status === "failed" ? "opacity-60" : ""}`}
                                                >
                                                    {m.text}
                                                    {m.status === "pending" && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                                            <div className="w-2 h-2 border border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                    {m.status === "failed" && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                                                            !
                                                        </div>
                                                    )}
                                                </div>
                                                {isMine && (
                                                    <span className="text-[10px] text-gray-500 self-end mt-0.5">{time}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* INPUT - ENHANCED WITH ATTACHMENT PREVIEW AREA */}
                            <form onSubmit={handleSend} className="border-t border-neutral-800 p-3 flex items-end gap-3 bg-neutral-900/50">
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        className="bg-[#0e0e0f] w-full p-3 rounded-xl outline-none resize-none placeholder-gray-400"
                                        placeholder={connected ? "Type a message..." : "Connecting..."}
                                        value={message}
                                        onChange={handleInputChange}
                                        disabled={!connected}
                                    />
                                    <Paperclip size={18} className={`absolute right-3 bottom-3 text-gray-400 transition-opacity ${!connected ? "opacity-50" : ""}`} />
                                </div>
                                <button
                                    type="submit"
                                    className={`p-3 rounded-xl transition-all duration-200 disabled:opacity-50 ${connected && message.trim()
                                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                                        : "bg-gray-600"}`}
                                    disabled={!connected || !message.trim()}
                                >
                                    <Send size={18} className={connected && message.trim() ? "rotate-45 scale-110" : ""} />
                                </button>
                            </form>
                        </>
                    ) : (
                        /* EMPTY STATE - ENHANCED WITH GRADIENT BACKGROUND */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl">
                            <EmptyChatSVG />
                            <h3 className="text-xl font-bold text-gray-200 mb-2 mt-4">
                                No Team Selected
                            </h3>
                            <p className="text-gray-400 max-w-sm leading-relaxed">
                                Pick a team from the list above to dive into the conversation. Your messages await!
                            </p>
                            <button
                                onClick={() => setShowTeams(true)}
                                className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                            >
                                View Teams
                            </button>
                        </div>
                    )}
                </div>

                {/* MEMBERS PANEL - RIGHT ON DESKTOP, MODAL ON MOBILE */}
                {showMembers && activeTeam && (
                    <div className="lg:bg-neutral-950 lg:w-72 lg:rounded-xl lg:flex lg:flex-col fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto animate-in slide-in-from-right duration-300 order-3 lg:order-3">
                        <div className="flex items-center justify-between p-3 lg:p-4 border-b lg:border-b-neutral-800 bg-neutral-900 lg:bg-neutral-950 rounded-t-xl lg:rounded-none">
                            <h2 className="font-bold text-base lg:text-lg">Team Roster</h2>
                            <button
                                onClick={toggleMembersPanel}
                                className="p-2 rounded-lg hover:bg-[#2d2e32] transition-colors lg:ml-auto"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 lg:p-4 max-h-[calc(100vh-200px)] lg:max-h-none [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden bg-neutral-900 lg:bg-neutral-950 rounded-b-xl lg:rounded-none">
                            {loadingMembers ? (
                                <div className="flex justify-center py-8">
                                    <div className="text-center">
                                        <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        <p className="text-gray-400">Fetching members...</p>
                                    </div>
                                </div>
                            ) : members.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {members.map((member) => (
                                        <div
                                            key={member._id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-[#1f2022]/50 hover:bg-[#1f2022] transition-colors border border-neutral-800"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                {member.firstName?.[0]}{member.lastName?.[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate text-white">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                {member.email && (
                                                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users size={48} className="text-gray-500 mb-4" />
                                    <p className="text-gray-400 text-sm">No team members yet</p>
                                </div>
                            )}
                        </div>
                        {!showMembers && (
                            <div
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={toggleMembersPanel}
                            />
                        )}
                    </div>
                )}
            </div>
        </PlayerLayoutNavbar>
    );
}