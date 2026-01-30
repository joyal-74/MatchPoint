import { Trophy, ArrowRight, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Team {
    _id: string;
    name: string;
    logo: string;
}

export interface MatchData {
    _id: string;
    teamA: Team;
    teamB: Team;
    matchId: string;
    scoreA: string;
    oversA: string;
    scoreB: string;
    oversB: string;
    isStreamLive: boolean;
    tournamentName?: string;
    matchNumber?: string;
    matchType?: string;
    venue?: string;
    status?: string;
}

interface LiveMatchCardProps {
    match: MatchData;
}

const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
    const navigate = useNavigate();

    const isTeamABatting = match.scoreB === "-" || match.scoreB === "0/0";

    return (
        <div 
            onClick={() => navigate(`/player/live/${match.matchId}/details`)}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* --- 1. Header: League & Live Status --- */}
            <div className="px-4 py-3 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-background rounded-md border border-border/50 shadow-sm text-yellow-600">
                        <Trophy size={12} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                            {match.tournamentName || "T20 League"}
                        </p>
                        <p className="text-xs font-semibold text-foreground leading-none">
                            {match.matchType || "Match 12"}
                        </p>
                    </div>
                </div>

                {match.isStreamLive && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                )}
            </div>

            {/* --- 2. The Scoreboard (Versus Layout) --- */}
            <div className="p-5 flex flex-col flex-1 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

                <div className="flex justify-between items-center relative z-10">
                    {/* Team A */}
                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className={`relative w-14 h-14 rounded-2xl p-1 mb-3 bg-background border ${isTeamABatting ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border'}`}>
                            <img src={match.teamA.logo} alt={match.teamA.name} className="w-full h-full object-contain" />
                            {isTeamABatting && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">
                                    Bat
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 max-w-[100px]">
                            {match.teamA.name}
                        </h3>
                    </div>

                    {/* VS / Score Center */}
                    <div className="flex flex-col items-center justify-center w-1/3 space-y-1">
                        <div className="text-2xl font-black text-foreground tracking-tight">
                            {isTeamABatting ? match.scoreA : match.scoreB}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                            {isTeamABatting ? match.oversA : match.oversB} Overs
                        </div>
                        <p className="text-[10px] text-muted-foreground pt-2 text-center leading-tight">
                            {match.scoreB === "-" 
                                ? `${match.teamA.name.split(' ')[0]} chose to bat` 
                                : `Target: ${parseInt(match.scoreA.split('/')[0] || "0") + 1}`}
                        </p>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center text-center w-1/3">
                         <div className={`relative w-14 h-14 rounded-2xl p-1 mb-3 bg-background border ${!isTeamABatting ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border'}`}>
                            <img src={match.teamB.logo} alt={match.teamB.name} className="w-full h-full object-contain" />
                             {!isTeamABatting && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">
                                    Bat
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 max-w-[100px]">
                            {match.teamB.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- 3. Footer Action --- */}
            <div className="p-3 bg-muted/20 border-t border-border/50">
                <button className="w-full group/btn flex items-center justify-between px-4 py-2.5 bg-background hover:bg-primary hover:text-primary-foreground border border-border/60 hover:border-primary/60 rounded-xl transition-all duration-300 shadow-sm">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Radio size={14} className="opacity-70" />
                        Go to Match Center
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