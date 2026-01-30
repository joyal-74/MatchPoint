import { Trophy, ArrowRight, Radio, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Match } from "../../domain/match/types"; 

interface LiveMatchCardProps {
    match: Match;
}

const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
    const navigate = useNavigate();
    
    const isTeamABatting = match.status === "ongoing" && 
        ((match.tossWinner === match.teamA._id && match.tossDecision === "Batting") || 
         (match.tossWinner === match.teamB._id && match.tossDecision === "Bowling"));

    return (
        <div 
            onClick={() => navigate(`/player/live/${match.matchId}/details`)}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* --- 1. Header Section --- */}
            <div className="px-4 py-3 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-background rounded-md border border-border/50 shadow-sm text-yellow-600">
                        <Trophy size={12} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                            {match.tournamentName}
                        </p>
                        <p className="text-xs font-semibold text-foreground leading-none">
                            Match {match.matchNumber} • Round {match.round}
                        </p>
                    </div>
                </div>

                {match.status === "ongoing" && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                )}
            </div>

            {/* --- 2. The Scoreboard --- */}
            <div className="p-5 flex flex-col flex-1 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>

                <div className="flex justify-between items-center relative z-10">
                    {/* Team A */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className={`relative w-14 h-14 rounded-2xl p-1 mb-3 bg-background border ${isTeamABatting ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border'}`}>
                            {match.teamA.logo ? (
                                <img src={match.teamA.logo} alt={match.teamA.name} className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center text-[10px] font-bold">
                                    {match.teamA.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            {isTeamABatting && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">
                                    Bat
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2">
                            {match.teamA.name}
                        </h3>
                    </div>

                    {/* VS / Info Center */}
                    <div className="flex flex-col items-center justify-center w-1/3 space-y-2">
                        <div className="text-xs font-black text-muted-foreground/40 tracking-[0.2em] uppercase">
                            VS
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                <MapPin size={10} /> {match.venue}
                            </span>
                            <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                {match.overs} Overs
                            </span>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center text-center w-1/3">
                         <div className={`relative w-14 h-14 rounded-2xl p-1 mb-3 bg-background border ${(!isTeamABatting && match.status === "ongoing") ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border'}`}>
                            {match.teamB.logo ? (
                                <img src={match.teamB.logo} alt={match.teamB.name} className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center text-[10px] font-bold">
                                    {match.teamB.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            {(!isTeamABatting && match.status === "ongoing") && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">
                                    Bat
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2">
                            {match.teamB.name}
                        </h3>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-medium italic">
                        {match.status === "upcoming" 
                            ? `Starting on ${new Date(match.date).toLocaleDateString()}` 
                            : match.winner 
                                ? `Winner: ${match.winner === match.teamA._id ? match.teamA.name : match.teamB.name}`
                                : "Match in progress"}
                    </p>
                </div>
            </div>

            {/* --- 3. Footer Action --- */}
            <div className="p-3 bg-muted/20 border-t border-border/50">
                <button className="w-full group/btn flex items-center justify-between px-4 py-2.5 bg-background hover:bg-primary hover:text-primary-foreground border border-border/60 hover:border-primary/60 rounded-xl transition-all duration-300 shadow-sm">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Radio size={14} className={match.status === "ongoing" ? "text-red-500 animate-pulse" : "opacity-70"} />
                        {match.status === "ongoing" ? "Watch Live Stream" : "View Match Details"}
                    </span>
                    <div className="bg-secondary/50 group-hover/btn:bg-white/20 p-1 rounded-full transition-colors">
                        <ArrowRight size={14} className="opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default LiveMatchCard;