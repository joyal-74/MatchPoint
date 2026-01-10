import { Trophy, CalendarDays } from "lucide-react";
import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const isBye = match.status === "bye";
    const isOngoing = match.status === "ongoing";
    const isCompleted = match.status === "completed";
    
    const getTeamOpacity = (teamName: string) => {
        if (!isCompleted || !match.winner) return "opacity-100";
        return match.winner === teamName ? "opacity-100" : "opacity-40 grayscale";
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return "TBD";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(date);
    };

    // --- TEAM AVATAR HELPER ---
    const TeamAvatar = ({ name, logo, className = "" }: { name: string; logo?: string; className?: string }) => {
        const baseClasses = `relative w-12 h-12 md:w-14 md:h-14 rounded-full ring-1 ring-border shadow-md flex items-center justify-center ${className}`;

        if (logo) {
            return (
                <div className={`${baseClasses} bg-background overflow-hidden p-1.5`}>
                    <img 
                        src={logo} 
                        alt={name} 
                        className="w-full h-full object-contain rounded-full" 
                    />
                </div>
            );
        }
        
        // Fallback for Initials using theme colors
        return (
            <div className={`${baseClasses} bg-muted`}>
                <span className="text-xs md:text-sm font-bold text-muted-foreground select-none">
                    {name ? name.substring(0, 2).toUpperCase() : "?"}
                </span>
            </div>
        );
    };

    return (
        <div className="group relative w-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer">
            
            {/* Top Bar: Match Number & Status */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    Match #{String(match.matchNumber).padStart(3, '0')}
                </span>
                
                {isOngoing && (
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Live</span>
                    </div>
                )}
                
                {isCompleted && (
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        Finished
                    </span>
                )}

                {!isOngoing && !isCompleted && !isBye && (
                    <span className="text-[10px] font-medium text-primary flex items-center gap-1">
                         Upcoming
                    </span>
                )}
            </div>

            {/* Main Content */}
            <div className="p-5">
                {isBye ? (
                    // --- BYE LAYOUT ---
                    <div className="flex items-center gap-4">
                        <TeamAvatar name={match.teamA || match.teamB || "TBD"} logo={match.teamLogoA || match.teamLogoB} />
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg leading-tight">
                                {match.teamA || match.teamB}
                            </span>
                            <span className="text-xs text-primary font-medium mt-1 inline-flex items-center gap-1">
                                <Trophy size={12} /> Auto-qualified
                            </span>
                        </div>
                    </div>
                ) : (
                    // --- STANDARD VS LAYOUT ---
                    <div className="flex items-center justify-between gap-2">
                        
                        {/* Team A (Left) */}
                        <div className={`flex flex-col items-center gap-3 w-[35%] transition-opacity duration-300 ${getTeamOpacity(match.teamA)}`}>
                            <TeamAvatar name={match.teamA} logo={match.teamLogoA} />
                            <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight line-clamp-2 w-full" title={match.teamA}>
                                {match.teamA}
                            </span>
                            {isCompleted && match.winner === match.teamA && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Trophy size={10} /> Winner
                                </span>
                            )}
                        </div>

                        {/* Center: VS or Score */}
                        <div className="flex flex-col items-center justify-center w-[30%] shrink-0 gap-2">
                            {isCompleted ? (
                                <div className="flex items-center gap-2">
                                    <span className={`text-2xl font-bold ${match.winner === match.teamA ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        -
                                    </span>
                                    <span className="text-muted-foreground text-lg">:</span>
                                    <span className={`text-2xl font-bold ${match.winner === match.teamB ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        -
                                    </span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center shadow-inner">
                                    <span className="text-[10px] font-black text-muted-foreground">VS</span>
                                </div>
                            )}

                            {/* Date / Venue Info */}
                            {!isCompleted && !isOngoing && (
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
                                        <CalendarDays size={10} />
                                        {formatDate(match.date)}
                                    </div>
                                    {match.venue && (
                                         <div className="text-[9px] text-muted-foreground max-w-[80px] truncate text-center" title={match.venue}>
                                             {match.venue.split(',')[0]}
                                         </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Team B (Right) */}
                        <div className={`flex flex-col items-center gap-3 w-[35%] transition-opacity duration-300 ${getTeamOpacity(match.teamB ?? 'Bye')}`}>
                            <TeamAvatar name={match.teamB ?? 'Bye'} logo={match.teamLogoB} />
                            <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight line-clamp-2 w-full" title={match.teamB}>
                                {match.teamB}
                            </span>
                            {isCompleted && match.winner === match.teamB && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Trophy size={10} /> Winner
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Hover Glow Effect using Primary Theme Color */}
            <div className="absolute -inset-px rounded-2xl border border-transparent group-hover:border-primary/20 pointer-events-none transition-colors duration-300" />
        </div>
    );
}