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
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-neutral-800 border-2 overflow-hidden shadow-2xl ${isVictorious ? 'border-amber-500' : 'border-white/10'}`}>
                        {logo ? (
                            <img src={logo} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-neutral-400">{getInitials(name)}</span>
                        )}
                    </div>

                    {/* Winner Crown Icon */}
                    {isVictorious && (
                        <div className="absolute -top-3 -right-3 bg-amber-500 text-black p-1.5 rounded-full shadow-lg border border-amber-400">
                            <Trophy size={16} fill="currentColor" />
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h3 className={`text-lg md:text-xl font-bold leading-tight ${isVictorious ? 'text-amber-400' : 'text-white'}`}>
                        {name}
                    </h3>
                    <span className="text-xs font-bold text-neutral-500 tracking-widest uppercase mt-1 block">
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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />

                {/* Header Bar */}
                <div className="relative flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 rounded bg-neutral-800 border border-white/10 text-xs font-mono text-neutral-400">
                            #{match.matchNumber}
                        </div>
                        <span className="text-sm font-medium text-neutral-200 flex items-center gap-1.5">
                            <Shield size={14} className="text-emerald-500" />
                            {match.round}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
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
                            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shadow-lg">
                                <span className="text-xs font-black text-neutral-500 italic">VS</span>
                            </div>
                            <span className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${match.status === 'ongoing'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse'
                                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                }`}>
                                {match.status}
                            </span>
                        </div>

                        <TeamDisplay name={match.teamB ?? ''} logo={match.teamLogoB} side="B" />
                    </div>

                    {/* Winner Announcement Banner */}
                    {hasWinner && (
                        <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-amber-900/20 via-amber-900/10 to-amber-900/20 border border-amber-500/20 flex items-center justify-center gap-2">
                            <Trophy size={16} className="text-amber-500" />
                            <span className="text-amber-200 text-sm font-medium">
                                Winner: <span className="font-bold text-amber-400">{match.winner}</span>
                            </span>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-800/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Date</p>
                                <p className="text-sm text-neutral-200 font-medium">
                                    {match.date ? new Date(match.date).toLocaleDateString() : "TBA"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-neutral-800/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <MapPin size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Venue</p>
                                <p
                                    className="text-sm text-neutral-200 font-medium truncate"
                                    title={match.venue || "Main Stadium"}
                                >
                                    {match.venue || "Main Stadium"}
                                </p>
                            </div>
                        </div>

                        {/* Example of extra stats if needed later */}
                        {match.status === 'ongoing' && (
                            <div className="col-span-2 bg-neutral-800/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Duration</p>
                                    <p className="text-sm text-neutral-200 font-medium">45' (First Half)</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}