import { Send, Users, X, Search, ChevronDown, MoreVertical, Loader2 } from "lucide-react";
import PlayerLayoutNavbar from "../../layout/PlayerLayoutWithNavbar";
import { useTeamChatLogic } from "../../../hooks/player/useTeamChatLogic";
import { UserAvatar } from "./UserAvatar";
import { EmptyState } from "./EmptyState";

export default function TeamChat(props: { initialChatId?: string; initialTeamId?: string }) {
    const {
        currentUser, teams, activeTeam, members, sortedMessages,
        messageInput, showMembers, showTeamsMobile, loadingMembers,
        isLoadingMore, hasMoreMessages, isNearBottom, chatStatus,
        handlers, refs
    } = useTeamChatLogic(props);

    const typingIndicator = chatStatus.typingUsers.length > 0
        ? `${chatStatus.typingUsers[0]?.name || "Someone"} is typing...` : null;

    return (
        <PlayerLayoutNavbar>
            {/* Container: Uses 'text-foreground' for base text color */}
            <div className="w-full h-[calc(100vh-150px)] min-h-[650px] max-w-[1600px] mx-auto flex gap-1 text-foreground py-4">

                <div className={`
                    flex flex-col w-full lg:w-72 bg-card border border-border rounded-xl overflow-hidden transition-all duration-300
                    ${showTeamsMobile ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:flex'}
                    `}>
                    <div className="p-4 border-b border-border bg-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold tracking-tight text-card-foreground">Teams</h2>
                            <button onClick={handlers.toggleTeamsMobile} className="lg:hidden p-2 hover:bg-muted rounded-full text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative group">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            {/* Input uses 'bg-input' or 'bg-muted' */}
                            <input
                                placeholder="Find a team..."
                                className="w-full bg-input border border-input focus:border-ring rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {teams.map((team) => (
                            <button
                                key={team._id}
                                onClick={() => handlers.handleSelectTeam(team)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                  ${activeTeam?._id === team._id
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <UserAvatar src={team.logo} name={team.name} size="md" />
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm truncate">
                                        {team.name}
                                    </p>
                                    <p className="text-xs opacity-70 truncate">Generic Sport</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* === CENTER: CHAT AREA === */}
                <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm relative">

                    {/* Mobile Header */}
                    <div className="lg:hidden p-4 border-b border-border flex items-center justify-between bg-card text-card-foreground">
                        <button onClick={handlers.toggleTeamsMobile} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <ChevronDown size={16} /> Teams
                        </button>
                        <span className="font-bold">{activeTeam?.name || "Chat"}</span>
                        {activeTeam && <button onClick={handlers.toggleMembers}><Users size={20} /></button>}
                    </div>

                    {activeTeam ? (
                        <>
                            {/* Chat Header */}
                            <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur z-10">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={activeTeam.logo} name={activeTeam.name} size="md" status={chatStatus.connected} />
                                    <div>
                                        <h2 className="font-bold text-card-foreground flex items-center gap-2">
                                            {activeTeam.name}
                                        </h2>
                                        <div className="flex items-center gap-2 h-4">
                                            {typingIndicator ? (
                                                <span className="text-xs text-primary animate-pulse font-medium">{typingIndicator}</span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    {/* Online dot uses Primary color */}
                                                    <span className={`w-1.5 h-1.5 rounded-full ${chatStatus.connected ? 'bg-primary' : 'bg-destructive'}`} />
                                                    {chatStatus.connected ? 'Online' : 'Reconnecting...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlers.toggleMembers} className={`p-2.5 rounded-lg transition-colors ${showMembers ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-muted-foreground'}`}>
                                        <Users size={20} />
                                    </button>
                                    <button className="p-2.5 rounded-lg hover:bg-muted text-muted-foreground">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Body */}
                            <div
                                ref={refs.messagesContainerRef}
                                onScroll={handlers.handleScroll}
                                className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar relative bg-background/50"
                            >
                                {isLoadingMore && (
                                    <div className="flex justify-center py-2"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                                )}

                                {!hasMoreMessages && sortedMessages.length > 0 && (
                                    <div className="text-center py-6">
                                        <span className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground border border-border">Start of conversation</span>
                                    </div>
                                )}

                                {chatStatus.loading && !isLoadingMore && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                )}

                                {sortedMessages.map((msg, idx) => {
                                    const isMine = msg.senderId === currentUser.id;
                                    const showHeader = idx === 0 || sortedMessages[idx - 1].senderId !== msg.senderId;

                                    return (
                                        <div key={msg.id || idx} className={`flex gap-3 ${isMine ? "flex-row-reverse" : "flex-row"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            {!isMine && (
                                                <div className="w-10 flex-shrink-0 flex flex-col items-center">
                                                    {showHeader ? <UserAvatar src={msg.profileImage} name={msg.senderName} /> : <div className="w-10" />}
                                                </div>
                                            )}

                                            <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                                                {showHeader && !isMine && (
                                                    <span className="text-xs text-muted-foreground font-medium ml-1 mb-1 block">{msg.senderName}</span>
                                                )}

                                                <div className={`
                                                    relative px-4 py-2.5 text-[15px] leading-relaxed shadow-sm
                                                    ${isMine
                                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" // My Message: Primary Color
                                                        : "bg-muted text-foreground rounded-2xl rounded-tl-sm border border-border" // Their Message: Muted Color
                                                    }
                                                ${msg.status === 'failed' ? 'border-destructive border opacity-80' : ''}
                                                `}>
                                                    {msg.text}
                                                    <span className={`text-[10px] ml-3 opacity-70 inline-block ${isMine ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div id="scroll-anchor" className="h-1" />
                            </div>

                            {/* Scroll Down Button */}
                            {!isNearBottom && (
                                <button
                                    onClick={handlers.scrollToBottom}
                                    className="absolute bottom-24 right-6 p-2 bg-popover border border-border text-primary rounded-full shadow-lg hover:bg-muted transition-all z-20"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            )}

                            {/* Input Area */}
                            <div className="p-4 bg-card border-t border-border">
                                <form onSubmit={handlers.handleSendMessage} className="relative flex items-end gap-2 bg-input/50 p-2 rounded-xl border border-input focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/20 transition-all">
                                    <input
                                        ref={refs.inputRef}
                                        value={messageInput}
                                        onChange={handlers.handleInputChange}
                                        placeholder={`Message ${activeTeam.name}...`}
                                        disabled={!chatStatus.connected}
                                        className="flex-1 bg-transparent justify-center border-none outline-none text-foreground placeholder:text-muted-foreground py-1.5 max-h-32 resize-none"
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() || !chatStatus.connected}
                                        className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center
                      ${messageInput.trim() && chatStatus.connected
                                                ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
                                                : "bg-muted text-muted-foreground cursor-not-allowed"}
                    `}
                                    >
                                        <Send size={18} className={messageInput.trim() ? "ml-0.5" : ""} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <EmptyState onAction={handlers.toggleTeamsMobile} />
                    )}
                </div>

                {/* === RIGHT SIDEBAR: MEMBERS === */}
                {showMembers && activeTeam && (
                    <div className="absolute inset-0 lg:static z-[60] lg:z-auto bg-background/80 lg:bg-transparent flex justify-end backdrop-blur-sm lg:backdrop-blur-none">
                        <div className="w-full lg:w-72 bg-card border-l border-border h-full flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl lg:shadow-none lg:rounded-r-xl">
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <h3 className="font-bold text-card-foreground">Team Members</h3>
                                <button onClick={handlers.toggleMembers} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {loadingMembers ? (
                                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                ) : members.length > 0 ? (
                                    members.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg transition-colors cursor-pointer group">
                                            <UserAvatar name={member.firstName} size="sm" />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">No members found</div>
                                )}
                            </div>
                        </div>
                        {/* Mobile backdrop click to close */}
                        <div className="flex-1 lg:hidden" onClick={handlers.toggleMembers}></div>
                    </div>
                )}
            </div>
        </PlayerLayoutNavbar>
    );
}