import { Send, Users, X, ChevronLeft, Loader2 } from "lucide-react";
import { useTeamChatLogic } from "../../../hooks/player/useTeamChatLogic";
import { UserAvatar } from "./UserAvatar";
import { EmptyState } from "./EmptyState";
import Navbar from "../../../components/player/Navbar";

export default function TeamChat() {
    const { 
        currentUser, activeTeam, teams, sortedMessages, messageInput, 
        handlers, refs, chatStatus, showMembers, members, loadingMembers 
    } = useTeamChatLogic({});

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Navbar />
            
            <div className="flex-1 flex w-full max-w-[1600px] mx-auto lg:p-4 lg:gap-4 overflow-hidden relative">

                {/* SQUAD LIST SIDEBAR */}
                <aside className={`
                    flex-col bg-card lg:border border-border/50 lg:rounded-[2rem] transition-all duration-300
                    ${activeTeam ? 'hidden lg:flex lg:w-80' : 'flex w-full lg:w-80'}
                `}>
                    <div className="p-6 font-black italic text-2xl uppercase text-primary border-b border-border/10">
                        Squads
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {teams.map((team) => (
                            <button
                                key={team._id}
                                onClick={() => handlers.handleSelectTeam(team)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                    activeTeam?._id === team._id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'
                                }`}
                            >
                                <UserAvatar src={team.logo} name={team.name} size="md" />
                                <div className="text-left font-bold text-sm truncate">{team.name}</div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CHAT INTERFACE */}
                <main className={`
                    flex-1 flex flex-col bg-card lg:border border-border/50 lg:rounded-[2rem] overflow-hidden 
                    ${!activeTeam ? 'hidden lg:flex' : 'flex'}
                `}>
                    {activeTeam ? (
                        <>
                            <header className="px-4 py-4 border-b border-border/50 flex items-center justify-between bg-card/80 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handlers.handleSelectTeam(null)} className="lg:hidden p-1 -ml-1 text-muted-foreground"><ChevronLeft size={28} /></button>
                                    <UserAvatar src={activeTeam.logo} name={activeTeam.name} size="md" status={chatStatus.connected} />
                                    <div className="flex flex-col">
                                        <h2 className="font-bold leading-none text-sm lg:text-base">{activeTeam.name}</h2>
                                        <span className="text-[10px] text-primary font-bold uppercase mt-1 tracking-widest">
                                            {chatStatus.connected ? "● Live Sync" : "Connecting..."}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handlers.toggleMembers} className="p-2 hover:bg-muted rounded-xl"><Users size={20} /></button>
                            </header>

                            {/* MESSAGES AREA */}
                            <div 
                                ref={refs.messagesContainerRef}
                                onScroll={handlers.handleScroll}
                                className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 space-y-1 custom-scrollbar bg-background"
                            >
                                {sortedMessages.map((msg, idx) => {
                                    // 1. Identify if message is from the logged-in user
                                    const isMine = msg.senderId === currentUser.id;
                                    
                                    // 2. Logic to group messages (hide name/avatar if same sender)
                                    const isSameAsPrev = idx > 0 && sortedMessages[idx - 1].senderId === msg.senderId;
                                    
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"} ${isSameAsPrev ? "mt-1" : "mt-6"} animate-in fade-in duration-300`}>
                                            
                                            {/* Show Avatar only for others and only on the first message of a group */}
                                            {!isMine && !isSameAsPrev && (
                                                <div className="mr-3 mt-1">
                                                    <UserAvatar src={msg.profileImage} name={msg.senderName} size="sm" />
                                                </div>
                                            )}
                                            
                                            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} ${isSameAsPrev && !isMine ? "ml-11" : ""}`}>
                                                
                                                {/* Show Name and Time only on the first message of a group */}
                                                {!isSameAsPrev && (
                                                    <span className="text-[11px] font-bold text-muted-foreground/60 mb-1 px-1 uppercase tracking-tight">
                                                        {isMine ? "You" : msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                                
                                                {/* The Message Bubble */}
                                                <div className={`
                                                    px-4 py-2.5 text-[15px] shadow-sm max-w-[85%] lg:max-w-xl transition-all
                                                    ${isMine 
                                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none" 
                                                        : "bg-muted text-foreground rounded-2xl rounded-tl-none border border-border/40"}
                                                    ${isSameAsPrev ? (isMine ? "rounded-tr-2xl" : "rounded-tl-2xl") : ""}
                                                `}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div id="scroll-anchor" className="h-4" />
                            </div>

                            {/* INPUT AREA */}
                            <footer className="p-4 pb-24 lg:pb-6 bg-card border-t border-border/50">
                                <form onSubmit={handlers.handleSendMessage} className="flex items-center gap-3 bg-muted/60 p-2 pl-4 rounded-[1.5rem] border border-border/50 focus-within:ring-2 ring-primary/5 transition-all">
                                    <input 
                                        value={messageInput} 
                                        onChange={handlers.handleInputChange} 
                                        placeholder="Type a message..." 
                                        className="flex-1 bg-transparent py-2.5 outline-none text-sm"
                                        autoComplete="off"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!messageInput.trim() || !chatStatus.connected}
                                        className="bg-primary text-white p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                             <EmptyState onAction={() => {}} />
                        </div>
                    )}
                </main>

                {/* ROSTER SIDEBAR */}
                {showMembers && activeTeam && (
                    <aside className="fixed inset-0 lg:static z-[100] lg:z-auto bg-background/80 lg:bg-transparent backdrop-blur-sm flex justify-end">
                        <div className="w-full lg:w-80 bg-card border-l border-border/50 h-full flex flex-col lg:rounded-[2rem] shadow-2xl animate-in slide-in-from-right duration-500">
                            <div className="p-6 border-b border-border/50 flex items-center justify-between">
                                <h3 className="text-lg font-black uppercase tracking-tighter">Roster</h3>
                                <button onClick={handlers.toggleMembers} className="p-2 hover:bg-muted rounded-full text-muted-foreground"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                {loadingMembers ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary/40" /></div>
                                ) : (
                                    members.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3 p-3 hover:bg-muted rounded-2xl transition-all cursor-pointer">
                                            <UserAvatar name={member.firstName} size="sm" />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-foreground truncate">{member.firstName} {member.lastName}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Active Player</p>
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