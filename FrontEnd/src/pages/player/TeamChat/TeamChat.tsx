import { useEffect } from "react";
import { 
    Send, Users, X, ChevronLeft, Loader2, Reply, 
    CornerUpRight, MoreVertical, CheckCheck 
} from "lucide-react";
import { useTeamChatLogic } from "../../../hooks/player/useTeamChatLogic";
import { UserAvatar } from "./UserAvatar";
import { EmptyState } from "./EmptyState";
import Navbar from "../../../components/player/Navbar";

export default function TeamChat() {
    const { 
        currentUser, activeTeam, teams, sortedMessages, messageInput, 
        handlers, refs, chatStatus, showMembers, members, loadingMembers,
        replyingTo
    } = useTeamChatLogic({});

    useEffect(() => {
        if (refs.messagesContainerRef.current) {
            const container = refs.messagesContainerRef.current;
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
        }
    }, [sortedMessages, activeTeam?._id]);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden pb-16 lg:pb-0">
            <Navbar />
            
            <div className="flex-1 flex w-full max-w-[1700px] mx-auto overflow-hidden shadow-sm bg-card lg:my-2 lg:rounded-[var(--radius)] lg:border border-border">

                {/* LEFT SIDEBAR: SQUAD LIST */}
                <aside className={`flex-col bg-card border-r border-border transition-all duration-300 ${activeTeam ? 'hidden lg:flex lg:w-[380px]' : 'flex w-full lg:w-[380px]'}`}>
                    <div className="p-4 border-b border-border bg-muted/20">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold tracking-tight">Messages</h1>
                            {/* <div className="flex gap-1 text-muted-foreground">
                                <button className="p-2 hover:bg-muted rounded-full transition-colors"><Search size={19} /></button>
                                <button className="p-2 hover:bg-muted rounded-full transition-colors"><MoreVertical size={19} /></button>
                            </div> */}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {teams.map((team) => (
                            <button
                                key={team._id}
                                onClick={() => handlers.handleSelectTeam(team)}
                                className={`w-full flex items-center gap-4 px-4 py-4 border-b border-border/50 transition-all ${
                                    activeTeam?._id === team._id ? 'bg-accent/40 border-r-4 border-r-primary' : 'hover:bg-muted/30'
                                }`}
                            >
                                <UserAvatar src={team.logo} name={team.name} size="lg" />
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-sm truncate">{team.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Squad</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate italic">Tap to open squad chat</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* MAIN CHAT INTERFACE */}
                <main className={`flex-1 flex flex-col bg-background relative overflow-hidden ${!activeTeam ? 'hidden lg:flex' : 'flex'}`}>
                    {activeTeam ? (
                        <>
                            {/* CHAT HEADER */}
                            <header className="px-4 py-3 bg-card border-b border-border flex items-center justify-between z-10">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <button onClick={() => handlers.handleSelectTeam(null)} className="lg:hidden p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <UserAvatar src={activeTeam.logo} name={activeTeam.name} size="md" status={chatStatus.connected} />
                                    <div className="flex flex-col cursor-pointer overflow-hidden" onClick={handlers.toggleMembers}>
                                        <h2 className="font-bold text-sm lg:text-base leading-tight truncate">{activeTeam.name}</h2>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${chatStatus.connected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                                {chatStatus.connected ? "Active Now" : "Connecting"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <button onClick={handlers.toggleMembers} className="p-2 hover:bg-muted rounded-full transition-colors"><Users size={20} /></button>
                                    <button className="p-2 hover:bg-muted rounded-full transition-colors"><MoreVertical size={20} /></button>
                                </div>
                            </header>

                            {/* MESSAGES AREA */}
                            <div 
                                ref={refs.messagesContainerRef} 
                                onScroll={handlers.handleScroll} 
                                className="flex-1 overflow-y-auto px-4 lg:px-12 py-6 space-y-1 custom-scrollbar relative"
                                style={{ 
                                    backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
                                    backgroundSize: '30px 30px' 
                                }}
                            >
                                {sortedMessages.map((msg, idx) => {
                                    const isMine = msg.senderId === currentUser.id;
                                    const gap = 5 * 60 * 1000;
                                    const isSameAsPrev = idx > 0 && 
                                        sortedMessages[idx - 1].senderId === msg.senderId &&
                                        (new Date(msg.createdAt).getTime() - new Date(sortedMessages[idx - 1].createdAt).getTime() < gap);

                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"} ${isSameAsPrev ? "mt-0.5" : "mt-4"} group/msg relative animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                                            
                                            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] lg:max-w-[65%]`}>
                                                
                                                <div className={`
                                                    relative px-3.5 py-1.5 text-[14.5px] shadow-sm transition-all
                                                    ${isMine 
                                                        ? "bg-primary text-primary-foreground" 
                                                        : "bg-card/70 backdrop-blur-md border border-border/50 text-card-foreground"}
                                                    ${isMine 
                                                        ? `${!isSameAsPrev ? "rounded-l-xl rounded-br-xl rounded-tr-none" : "rounded-xl"}` 
                                                        : `${!isSameAsPrev ? "rounded-r-xl rounded-bl-xl rounded-tl-none" : "rounded-xl"}`
                                                    }
                                                `}>
                                                    {/* SVG Transparent-Safe Tail */}
                                                    {!isSameAsPrev && (
                                                        <div className={`absolute top-0 w-3 h-3 ${isMine ? "-right-2" : "-left-2"}`}>
                                                            <svg viewBox="0 0 16 16" className={isMine ? "text-primary" : "text-card/70 fill-card/70 stroke-border/50"}>
                                                                <path fill="currentColor" d={isMine ? "M0,0 L16,0 L0,16 Z" : "M16,0 L0,0 L16,16 Z"} />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Reply Block */}
                                                    {msg.replyTo && msg.replyTo.messageId && (
                                                        <div className={`mb-2 p-2 rounded-md text-xs border-l-[3px] truncate ${
                                                            isMine ? "bg-black/20 border-white/40" : "bg-muted border-primary"
                                                        }`}>
                                                            <p className="font-bold mb-0.5 opacity-90">{msg.replyTo.senderName}</p>
                                                            <p className="opacity-70 truncate italic line-clamp-1">{msg.replyTo.text}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Sender Name (Others) */}
                                                    {!isMine && !isSameAsPrev && (
                                                        <span className="text-[12px] font-bold text-primary block mb-0.5">{msg.senderName}</span>
                                                    )}

                                                    <div className="flex gap-2 items-end">
                                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                        <div className={`flex items-center gap-1 text-[9px] min-w-fit tabular-nums font-medium ${isMine ? "text-primary-foreground/60" : "text-muted-foreground/80"}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            {isMine && (
                                                                <CheckCheck size={12} className={msg.status === 'sent' ? 'text-blue-400' : 'text-primary-foreground/40'} />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Hover Reply Button */}
                                                    <button 
                                                        onClick={() => handlers.setReplyingTo(msg)}
                                                        className={`absolute top-1/2 -translate-y-1/2 p-2 bg-card border border-border shadow-md rounded-full text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/msg:opacity-100 z-20 ${isMine ? "-left-12" : "-right-12"}`}
                                                    >
                                                        <Reply size={15} className={!isMine ? "scale-x-[-1]" : ""} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div id="scroll-anchor" className="h-4" />
                            </div>

                            {/* CHAT INPUT AREA */}
                            <footer className="px-4 py-4 bg-card border-t border-border">
                                {replyingTo && (
                                    <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2 bg-muted/50 border-l-4 border-primary rounded-t-md mb-[-2px] animate-in slide-in-from-bottom-1">
                                        <div className="flex items-center gap-3 overflow-hidden text-xs">
                                            <CornerUpRight size={14} className="text-primary flex-shrink-0" />
                                            <div className="truncate">
                                                <span className="font-bold text-primary block">{replyingTo.senderName}</span>
                                                <span className="text-muted-foreground truncate italic">{replyingTo.text}</span>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handlers.setReplyingTo(null)} className="p-1 hover:bg-muted rounded-full text-muted-foreground"><X size={15} /></button>
                                    </div>
                                )}

                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlers.handleSendMessage(e);
                                    }} 
                                    className="max-w-4xl mx-auto flex items-center gap-3"
                                >
                                    <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-full px-4 focus-within:bg-card focus-within:ring-2 ring-primary/20 transition-all">
                                        <input 
                                            value={messageInput} 
                                            onChange={handlers.handleInputChange} 
                                            placeholder={replyingTo ? `Reply to ${replyingTo.senderName}...` : "Write your message..."} 
                                            className="flex-1 bg-transparent py-3 outline-none text-[14px] placeholder:text-muted-foreground/60"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={!messageInput.trim() || !chatStatus.connected}
                                        className="p-3.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12 bg-muted/5">
                             <EmptyState onAction={() => {}} />
                        </div>
                    )}
                </main>

                {/* ROSTER SIDEBAR */}
                {showMembers && activeTeam && (
                    <aside className="fixed inset-0 lg:static z-[100] lg:z-auto bg-background/80 lg:bg-transparent backdrop-blur-sm flex justify-end">
                        <div className="w-full lg:w-[350px] bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
                                <h3 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Team Roster</h3>
                                <button onClick={handlers.toggleMembers} className="p-1 hover:bg-muted rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                                {loadingMembers ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary/40" /></div>
                                ) : (
                                    members.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-[var(--radius)] transition-all cursor-pointer">
                                            <UserAvatar name={member.firstName} size="sm" />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold truncate">{member.firstName} {member.lastName}</p>
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Verified Player</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="flex-1 lg:hidden" onClick={handlers.toggleMembers}></div>
                    </aside>
                )}
            </div>
        </div>
    );
}