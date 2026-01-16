import { Trophy, ArrowRight, PlayCircle, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Match } from "../../features/viewer/viewerTypes";

const getTeamShortName = (teamName: string) => {
    return teamName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
};

interface LiveMatchCardProps {
    match: Match; 
}

const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
    const navigate = useNavigate();

    // Mock scores if missing (safe fallback)
    const scoreA = match.innings1 ? `${match.innings1.runs}/${match.innings1.wickets}` : "0/0";
    const oversA = match.innings1 ? match.innings1.overs : "0.0";
    const scoreB = match.innings2 ? `${match.innings2.runs}/${match.innings2.wickets}` : "Yet to Bat";
    const oversB = match.innings2 ? match.innings2.overs : "";

    return (
        <div 
            onClick={() => navigate(`/live/${match.matchId}/details`)}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col"
        >
            {/* --- Card Header: League & Status --- */}
            <div className="px-5 py-4 flex justify-between items-start border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 bg-background rounded-lg border border-border shrink-0">
                        <Trophy size={14} className="text-yellow-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                            {match.tournamentName || "Tournament"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                            {match.matchType || "T20"} • {match.venue?.split(',')[0]}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                    <Radio size={12} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                </div>
            </div>

            {/* --- Card Body: The Scoreboard --- */}
            <div className="p-5 flex-1 flex flex-col justify-center">
                
                {/* Team A */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                            {getTeamShortName(match.teamA)}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg leading-tight">{match.teamA}</h3>
                            {match.currentInnings === 1 && <span className="text-[10px] text-primary font-medium">Batting</span>}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{scoreA}</div>
                        <div className="text-xs text-muted-foreground">({oversA} ov)</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border w-full mb-4" />

                {/* Team B */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground border border-border flex items-center justify-center font-bold text-xs">
                            {getTeamShortName(match.teamB || "TBA")}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg leading-tight">{match.teamB || "TBA"}</h3>
                            {match.currentInnings === 2 && <span className="text-[10px] text-primary font-medium">Batting</span>}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{scoreB}</div>
                        {oversB && <div className="text-xs text-muted-foreground">({oversB} ov)</div>}
                    </div>
                </div>

            </div>

            {/* --- Card Footer: Action --- */}
            <div className="px-5 pb-5 pt-0 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm group/btn">
                    <PlayCircle size={16} className="fill-current" />
                    <span>Watch Center</span>
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-200" />
                </button>
            </div>
        </div>
    );
};

export default LiveMatchCard;