import { X, Trophy, Calendar, MapPin, Shield, Clock } from "lucide-react";
import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchDetailsModalProps {
    match: Match | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
    if (!isOpen || !match) return null;

    const isWinner = (teamName: string) => match.winner === teamName;
    const hasWinner = !!match.winner;

    // Helper to generate initials if logo is missing
    const getInitials = (name?: string) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    };

    // Helper to render a Team Column
    const TeamDisplay = ({ name, logo, side }: { name: string; logo?: string; side: 'A' | 'B' }) => {
        const isVictorious = isWinner(name);
        const isLoser = hasWinner && !isVictorious;

        return (
            <div className={`flex flex-col items-center gap-4 flex-1 transition-opacity duration-300 ${isLoser ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                <div className="relative group">
                    {/* Winner Glow Effect */}
                    {isVictorious && (
                        <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full" />
                    )}

                    {/* Avatar Container */}
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-muted border-2 overflow-hidden shadow-2xl ${isVictorious ? 'border-amber-500' : 'border-border'}`}>
                        {logo ? (
                            <img src={logo} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-muted-foreground">{getInitials(name)}</span>
                        )}
                    </div>

                    {/* Winner Crown Icon */}
                    {isVictorious && (
                        <div className="absolute -top-3 -right-3 bg-amber-500 text-amber-950 p-1.5 rounded-full shadow-lg border border-amber-400">
                            <Trophy size={16} fill="currentColor" />
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h3 className={`text-lg md:text-xl font-bold leading-tight ${isVictorious ? 'text-amber-500' : 'text-foreground'}`}>
                        {name}
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1 block">
                        {side === 'A' ? 'Home' : 'Away'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Background Decoration using Primary Theme Color */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                {/* Header Bar */}
                <div className="relative flex items-center justify-between p-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 rounded bg-muted border border-border text-xs font-mono text-muted-foreground">
                            #{match.matchNumber}
                        </div>
                        <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <Shield size={14} className="text-primary" />
                            {match.round}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8">

                    {/* The Matchup Face-off */}
                    <div className="flex items-start justify-between gap-4 md:gap-8 mb-8">
                        <TeamDisplay name={match.teamA} logo={match.teamLogoA} side="A" />

                        {/* Center VS Badge */}
                        <div className="flex flex-col items-center justify-center mt-8 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg">
                                <span className="text-xs font-black text-muted-foreground italic">VS</span>
                            </div>
                            
                            <span className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${match.status === 'ongoing'
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 animate-pulse'
                                    : 'bg-muted text-muted-foreground border-border'
                                }`}>
                                {match.status}
                            </span>
                        </div>

                        <TeamDisplay name={match.teamB ?? ''} logo={match.teamLogoB} side="B" />
                    </div>

                    {/* Winner Announcement Banner */}
                    {hasWinner && (
                        <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2">
                            <Trophy size={16} className="text-amber-500" />
                            <span className="text-amber-700 dark:text-amber-200 text-sm font-medium">
                                Winner: <span className="font-bold text-amber-600 dark:text-amber-400">{match.winner}</span>
                            </span>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-xl p-3 border border-border flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Date</p>
                                <p className="text-sm text-foreground font-medium">
                                    {match.date ? new Date(match.date).toLocaleDateString() : "TBA"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-xl p-3 border border-border flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                                <MapPin size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Venue</p>
                                <p
                                    className="text-sm text-foreground font-medium truncate"
                                    title={match.venue || "Main Stadium"}
                                >
                                    {match.venue || "Main Stadium"}
                                </p>
                            </div>
                        </div>

                        {/* Example of extra stats if needed later */}
                        {match.status === 'ongoing' && (
                            <div className="col-span-2 bg-muted/30 rounded-xl p-3 border border-border flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Duration</p>
                                    <p className="text-sm text-foreground font-medium">45' (First Half)</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}