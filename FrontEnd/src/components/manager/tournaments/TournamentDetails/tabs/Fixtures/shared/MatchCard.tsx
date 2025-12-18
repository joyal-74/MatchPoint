import { Trophy, CalendarDays } from "lucide-react";
import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const isBye = match.status === "bye";
    const isOngoing = match.status === "ongoing";
    const isCompleted = match.status === "completed";
    
    // Determine winner/loser opacity for completed matches
    const getTeamOpacity = (teamName: string) => {
        if (!isCompleted || !match.winner) return "opacity-100";
        return match.winner === teamName ? "opacity-100" : "opacity-40 grayscale";
    };

    // Helper: Format Date (Native JS version)
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

    // --- FIXED TEAM AVATAR HELPER ---
    const TeamAvatar = ({ name, logo, className = "" }: { name: string; logo?: string; className?: string }) => {
        // Common base classes for circle shape, size, and shadow
        const baseClasses = `relative w-12 h-12 md:w-14 md:h-14 rounded-full ring-1 ring-white/10 shadow-lg flex items-center justify-center ${className}`;

        if (logo) {
            return (
                // Added overflow-hidden to clip square images into the circle
                // Adjusted padding and background for better logo contrast
                <div className={`${baseClasses} bg-neutral-950 overflow-hidden p-1.5`}>
                    <img 
                        src={logo} 
                        alt={name} 
                        // Added rounded-full here too as a safeguard, and object-contain to keep aspect ratio
                        className="w-full h-full object-contain rounded-full" 
                    />
                </div>
            );
        }
        
        // Fallback for Initials
        return (
            <div className={`${baseClasses} bg-gradient-to-br from-neutral-800 to-neutral-900`}>
                <span className="text-xs md:text-sm font-bold text-neutral-400 select-none">
                    {name ? name.substring(0, 2).toUpperCase() : "?"}
                </span>
            </div>
        );
    };

    return (
        <div className="group relative w-full overflow-hidden rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 cursor-pointer">
            
            {/* Top Bar: Match Number & Status */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
                <span className="text-[10px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
                    Match #{String(match.matchNumber).padStart(3, '0')}
                </span>
                
                {isOngoing && (
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                    </div>
                )}
                
                {isCompleted && (
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                        Finished
                    </span>
                )}

                {!isOngoing && !isCompleted && !isBye && (
                    <span className="text-[10px] font-medium text-blue-400/80 flex items-center gap-1">
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
                            <span className="font-bold text-white text-lg leading-tight">
                                {match.teamA || match.teamB}
                            </span>
                            <span className="text-xs text-emerald-400 font-medium mt-1 inline-flex items-center gap-1">
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
                            <span className="text-xs md:text-sm font-semibold text-neutral-200 text-center leading-tight line-clamp-2 w-full" title={match.teamA}>
                                {match.teamA}
                            </span>
                            {isCompleted && match.winner === match.teamA && (
                                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    <Trophy size={10} /> Winner
                                </span>
                            )}
                        </div>

                        {/* Center: VS or Score */}
                        <div className="flex flex-col items-center justify-center w-[30%] shrink-0 gap-2">
                            {isCompleted ? (
                                <div className="flex items-center gap-2">
                                    {/* Placeholder scores if you have them in the future: match.scoreA */}
                                    <span className={`text-2xl font-bold ${match.winner === match.teamA ? 'text-white' : 'text-neutral-600'}`}>
                                        -
                                    </span>
                                    <span className="text-neutral-700 text-lg">:</span>
                                    <span className={`text-2xl font-bold ${match.winner === match.teamB ? 'text-white' : 'text-neutral-600'}`}>
                                        -
                                    </span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                    <span className="text-[10px] font-black text-neutral-600">VS</span>
                                </div>
                            )}

                            {/* Date / Venue Info */}
                            {!isCompleted && !isOngoing && (
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-950/30 px-2 py-1 rounded">
                                        <CalendarDays size={10} />
                                        {formatDate(match.date)}
                                    </div>
                                    {match.venue && (
                                         <div className="text-[9px] text-neutral-600 max-w-[80px] truncate text-center" title={match.venue}>
                                            {match.venue.split(',')[0]}
                                         </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Team B (Right) */}
                        <div className={`flex flex-col items-center gap-3 w-[35%] transition-opacity duration-300 ${getTeamOpacity(match.teamB ?? 'Bye')}`}>
                            <TeamAvatar name={match.teamB ?? 'Bye'} logo={match.teamLogoB} />
                            <span className="text-xs md:text-sm font-semibold text-neutral-200 text-center leading-tight line-clamp-2 w-full" title={match.teamB}>
                                {match.teamB}
                            </span>
                            {isCompleted && match.winner === match.teamB && (
                                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    <Trophy size={10} /> Winner
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute -inset-px rounded-2xl border border-transparent group-hover:border-emerald-500/20 pointer-events-none transition-colors duration-300" />
        </div>
    );
}