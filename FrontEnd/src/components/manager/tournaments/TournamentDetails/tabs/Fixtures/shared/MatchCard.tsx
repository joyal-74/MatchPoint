import { Clock, Trophy } from "lucide-react";
import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
    const isBye = match.status === "bye";
    const isOngoing = match.status === "ongoing";
    const isCompleted = match.status === "completed";

    // Helper to generate initials for team avatars
    const getInitials = (name: string | null) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Helper for Status Badge styling
    const getStatusBadge = () => {
        switch (match.status) {
            case "completed":
                return (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider">
                        Finished
                    </span>
                );
            case "ongoing":
                return (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live
                    </span>
                );
            case "bye":
                return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                        Bye
                    </span>
                );
            default: // scheduled
                return (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        <Clock size={10} />
                        Upcoming
                    </span>
                );
        }
    };

    return (
        <div className="group relative bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-neutral-800/40 transition-all duration-300 w-full">
            
            {/* Header: Match # and Status */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    #{String(match.matchNumber).padStart(3, '0')}
                </span>
                {getStatusBadge()}
            </div>

            {/* Content: Team vs Team */}
            {isBye ? (
                // BYE Layout
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-bold">
                        {getInitials(match.teamA || match.teamB)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">{match.teamA || match.teamB}</span>
                        <span className="text-xs text-neutral-500">Auto-qualified for next round</span>
                    </div>
                    <div className="ml-auto">
                        <Trophy size={16} className="text-amber-500/50" />
                    </div>
                </div>
            ) : (
                // Standard Match Layout
                <div className="flex items-center justify-between gap-2">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center text-neutral-400 text-xs font-bold group-hover:border-neutral-700 transition-colors">
                            {getInitials(match.teamA)}
                        </div>
                        <span className="text-xs md:text-sm font-medium text-neutral-200 text-center line-clamp-1 w-full" title={match.teamA}>
                            {match.teamA}
                        </span>
                    </div>

                    {/* Center Score/VS */}
                    <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
                        {isCompleted || isOngoing ? (
                            <div className="px-3 py-1 bg-neutral-950 rounded border border-white/10">
                                <span className={`text-lg font-bold tracking-widest ${isOngoing ? 'text-emerald-400' : 'text-white'}`}>
                                    {/* Placeholder scores - replace with match.scoreA if available */}
                                    
                                </span>
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-neutral-500">VS</span>
                            </div>
                        )}
                        
                        {/* Optional Date (if not completed) */}
                        {!isCompleted && !isOngoing && (
                            <span className="mt-1 text-[10px] text-neutral-600">
                                --:--
                            </span>
                        )}
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center text-neutral-400 text-xs font-bold group-hover:border-neutral-700 transition-colors">
                            {getInitials(match.teamB)}
                        </div>
                        <span className="text-xs md:text-sm font-medium text-neutral-200 text-center line-clamp-1 w-full" title={match.teamB ?? null}>
                            {match.teamB}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}