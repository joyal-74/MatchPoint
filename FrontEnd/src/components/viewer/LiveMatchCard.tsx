import { MapPin, Trophy, ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Match } from "../../features/viewer/viewerTypes";

// Helper for Team Short Name
const getTeamShortName = (teamName: string) => {
    return teamName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3); // Limit to 3 chars
};

// Helper for Short Venue
const getShortVenue = (venue: string) => {
    if (!venue) return "Venue TBD";
    return venue.split(",")[0].trim();
};

interface LiveMatchCardProps {
    match: Match; 
}

const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
            
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Bar: Status & Tournament */}
            <div className="relative p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <span className="text-xs font-bold text-red-500 tracking-wider uppercase">Live Now</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 bg-white/5 px-2 py-1 rounded-md">
                    <Trophy size={12} className="text-yellow-500" />
                    <span className="truncate max-w-[120px]">{match.matchType || 'T20 Match'}</span>
                </div>
            </div>

            {/* Middle: Teams & Score */}
            <div className="relative p-6 space-y-6">
                
                {/* Team A */}
                <div className="flex items-center justify-between group/team">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shadow-lg group-hover/team:border-blue-500/30 transition-colors">
                            <span className="font-bold text-sm text-blue-400 tracking-wider">
                                {getTeamShortName(match.teamA)}
                            </span>
                        </div>
                        <span className="font-semibold text-white text-lg truncate" title={match.teamA}>
                            {match.teamA}
                        </span>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center gap-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">VS</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                </div>

                {/* Team B */}
                <div className="flex items-center justify-between group/team">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shadow-lg group-hover/team:border-red-500/30 transition-colors">
                            <span className="font-bold text-sm text-red-400 tracking-wider">
                                {getTeamShortName(match.teamB ?? '') || 'Bye'}
                            </span>
                        </div>
                        <span className="font-semibold text-white text-lg truncate" title={match.teamB}>
                            {match.teamB}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom: Info & Action */}
            <div className="relative px-6 pb-6 pt-2">
                <div className="flex items-center justify-between mb-5 text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {getShortVenue(match.venue)}
                    </div>
                </div>

                <button 
                    onClick={() => navigate(`/live/${match._id}/details`)}
                    className="w-full group/btn relative flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-all active:scale-[0.98]"
                >
                    <PlayCircle size={16} className="text-neutral-900 group-hover/btn:fill-current transition-all" />
                    Watch Match
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                </button>
            </div>
        </div>
    );
};

export default LiveMatchCard;