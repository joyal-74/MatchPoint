import { Trophy, ArrowRight, Radio, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LiveMatchCardProps {
    match: any;
}

const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
    const navigate = useNavigate();

    console.log(match)

    const isTeamABatting = match.status === "ongoing" && match.currentInningsNumber === 1;

    return (
        <div 
            onClick={() => navigate(`${match.matchId}/details`)}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* --- 1. Header Section --- */}
            <div className="px-4 py-3 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-background rounded-md border border-border/50 shadow-sm text-yellow-600">
                        <Trophy size={12} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">
                            {match.tournamentName || "Friendly Match"}
                        </p>
                        <p className="text-[10px] font-medium text-primary leading-none">
                            {match.type}
                        </p>
                    </div>
                </div>

                {match.status === "ongoing" && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest">Live</span>
                    </div>
                )}
            </div>

            {/* --- 2. The Scoreboard --- */}
            <div className="p-5 flex flex-col flex-1 relative bg-gradient-to-b from-transparent to-muted/20">
                <div className="flex justify-between items-center relative z-10">
                    {/* Team A */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black mb-2 border transition-all ${isTeamABatting ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted border-border text-muted-foreground'}`}>
                            {(match.teamA || "??").substring(0, 2).toUpperCase()}
                        </div>
                        <h3 className="font-bold text-xs text-foreground leading-tight line-clamp-2">
                            {match.teamA}
                        </h3>
                    </div>

                    {/* VS / Info Center */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <div className="text-[10px] font-black text-muted-foreground/30 tracking-[0.2em] mb-2">VS</div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[14px] font-black tabular-nums">
                                {match.runs}/{match.wickets}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground opacity-70">
                                {match.overs} ov
                            </span>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black mb-2 border transition-all ${(!isTeamABatting && match.status === "ongoing") ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted border-border text-muted-foreground'}`}>
                            {(match.teamB || "??").substring(0, 2).toUpperCase()}
                        </div>
                        <h3 className="font-bold text-xs text-foreground leading-tight line-clamp-2">
                            {match.teamB}
                        </h3>
                    </div>
                </div>

                {/* Venue snippet */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-center gap-1">
                    <MapPin size={10} className="text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">
                        {match.venue.split(',')[0]}
                    </p>
                </div>
            </div>

            {/* --- 3. Footer Action --- */}
            <div className="p-3 bg-muted/20 border-t border-border/50">
                <button className="w-full group/btn flex items-center justify-between px-4 py-2 bg-background hover:bg-primary hover:text-primary-foreground border border-border/60 rounded-xl transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Radio size={12} className={match.status === "ongoing" ? "text-red-500 animate-pulse" : ""} />
                        {match.status === "ongoing" ? "Watch Stream" : "Match Info"}
                    </span>
                    <ArrowRight size={12} className="opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LiveMatchCard;