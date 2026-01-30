import { ArrowLeft, MapPin, Trophy, Tv, Users, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Match, Team } from "../../../domain/match/types";

interface MatchHeaderProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    connectionStatus: string;
    viewerCount: number;
    onBack: () => void;
    isStreamOnline: boolean;
}

export const MatchHeader = ({
    match, teamA, teamB,
    connectionStatus, viewerCount,
    onBack, isStreamOnline
}: MatchHeaderProps) => {
    const navigate = useNavigate();

    // Helper to get initials
    const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "??";

    // Helper for team logo rendering
    const TeamLogo = ({ team }: { team: Team }) => (
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm md:text-xl font-bold text-muted-foreground">{getInitials(team.name)}</span>
            )}
        </div>
    );

    const handleStreamClick = () => {
        if (isStreamOnline) {
            navigate(`/live/${match._id}/details/stream`);
        }
    };

    return (
        <div className="relative bg-background border-b border-border transition-colors duration-300">
            
            {/* Subtle Background Ambience */}
            <div className="absolute inset-0 bg-muted/20 pointer-events-none" />

            {/* Top Bar: Navigation & Connection */}
            <div className="relative z-10 border-b border-border bg-background/50 backdrop-blur-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Matches
                    </button>

                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider">
                        <div className={`flex items-center gap-1.5 ${connectionStatus === 'connected' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {connectionStatus === 'connected' ? <Wifi size={12} /> : <WifiOff size={12} />}
                            {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header Content */}
            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">

                    {/* LEFT: Match Info & Teams */}
                    <div className="flex-1 w-full">
                        
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 text-xs font-medium text-muted-foreground">
                            <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-bold tracking-wider uppercase">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                                Live
                            </span>
                            <div className="h-4 w-px bg-border hidden md:block" />
                            <span className="flex items-center gap-1.5"><Trophy size={14} className="text-primary" /> {match.tournamentName || 'Tournament'}</span>
                            <span className="hidden md:inline">•</span>
                            <span>{match.overs ? `${match.overs} Overs` : 'T20'}</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {match.venue || 'Venue TBD'}</span>
                        </div>

                        {/* Teams Face-off */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-10">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg md:text-3xl text-foreground tracking-tight text-right">{teamA.name}</span>
                                <TeamLogo team={teamA} />
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <span className="text-muted-foreground/40 font-black text-2xl italic">VS</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <TeamLogo team={teamB} />
                                <span className="font-bold text-lg md:text-3xl text-foreground tracking-tight">{teamB.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Actions (Stream Button) */}
                    <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                        
                        {/* Stream CTA Button */}
                        <button
                            onClick={handleStreamClick}
                            disabled={!isStreamOnline}
                            className={`
                                group relative w-full lg:w-auto overflow-hidden rounded-xl p-[1px] transition-all active:scale-95
                                ${isStreamOnline ? 'cursor-pointer hover:shadow-lg hover:shadow-primary/20' : 'cursor-not-allowed opacity-70 grayscale'}
                            `}
                        >
                            {/* Animated Gradient Border */}
                            <span className={`absolute inset-[-1000%] animate-[spin_3s_linear_infinite] ${isStreamOnline ? 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-primary)_50%,transparent_100%)]' : 'bg-border'}`} />
                            
                            {/* Button Content */}
                            <span className="relative flex h-full w-full items-center justify-center gap-2.5 rounded-xl bg-background px-8 py-3.5 text-sm font-bold text-foreground backdrop-blur-3xl transition-colors group-hover:bg-muted/50">
                                {isStreamOnline ? (
                                    <>
                                        <Tv size={18} className="text-primary group-hover:text-foreground transition-colors" />
                                        <span>WATCH LIVE STREAM</span>
                                        <span className="flex h-2 w-2 relative ml-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Tv size={18} className="text-muted-foreground" />
                                        <span className="text-muted-foreground">STREAM OFFLINE</span>
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Viewer Count */}
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                            <Users size={12} className="text-primary" />
                            <span className="text-foreground font-mono">{viewerCount.toLocaleString()}</span> viewers watching
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};