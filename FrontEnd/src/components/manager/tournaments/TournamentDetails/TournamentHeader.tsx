import {
    Trophy,
    Calendar,
    ArrowLeft,
    Share2,
    Edit3,
    Ticket,
    CheckCircle2,
    Users
} from "lucide-react";
import type { Tournament } from "../../../../features/manager/managerTypes";

interface TournamentHeaderProps {
    tournamentData: Tournament;
    type: "manage" | "explore";
    onClick?: () => void;
    onBack?: () => void;
    isRegistered?: boolean;
}

export default function TournamentHeader({
    tournamentData,
    type,
    onClick,
    onBack,
    isRegistered
}: TournamentHeaderProps) {

    const isOngoing = tournamentData.status === "ongoing";

    const dateRange = `${new Date(tournamentData.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(tournamentData.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
        <div className="relative w-full bg-neutral-950 border-b border-white/10 overflow-hidden group">

            {/* --- Background Layer (Same visual, just clipped) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/0 via-neutral-950/60 to-neutral-950" />
            </div>

            {/* Reduced vertical padding (py-6 instead of py-12) */}
            <div className="relative z-10 w-full px-5 md:px-8 py-6">

                {/* --- Top Navigation --- */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-all text-[11px] font-medium uppercase tracking-wider"
                    >
                        <ArrowLeft size={12} />
                        <span>Back</span>
                    </button>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${isOngoing
                            ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(74,222,128,0.1)]"
                            : "bg-neutral-800/50 text-neutral-400 border-neutral-700"
                        }`}>
                        <span className={`w-1 h-1 rounded-full ${isOngoing ? "bg-green-400 animate-pulse" : "bg-neutral-500"}`} />
                        {tournamentData.status}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">

                    {/* --- Main Content --- */}
                    <div className="space-y-4 max-w-3xl">

                        {/* Title Section */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <Trophy className="text-emerald-500" size={14} />
                                <span className="text-emerald-500 font-bold tracking-widest text-xs uppercase">
                                    {tournamentData.sport} Tournament
                                </span>
                            </div>
                            {/* Reduced text size: text-3xl/4xl instead of 6xl */}
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                                {tournamentData.title}
                            </h1>
                        </div>

                        {/* Info Grid Pills - Smaller padding and text */}
                        <div className="flex flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                                <Calendar size={14} className="text-neutral-400" />
                                <span className="font-medium">{dateRange}</span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 sm:flex">
                                <Users size={14} className="text-neutral-400" />
                                <span className="font-medium">32 Teams</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Action Section --- */}
                    <div className="flex flex-row items-center gap-2.5">

                        {type === "manage" ? (
                            <>
                                <button className="h-9 px-4 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-sm font-medium transition-all flex items-center gap-2">
                                    <Share2 size={14} />
                                    <span>Share</span>
                                </button>
                                <button className="h-9 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                                    <Edit3 size={14} />
                                    <span>Manage</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {isRegistered ? (
                                    <div className="px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        <div className="flex flex-col">
                                            <span className="text-emerald-100 font-bold text-xs">Registered</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button className="h-10 w-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-white/5 transition-colors flex items-center justify-center">
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={onClick}
                                            className="h-10 px-5 rounded-lg bg-white text-black hover:bg-neutral-200 font-bold text-sm shadow-lg shadow-white/5 transition-all transform active:scale-95 flex items-center gap-2"
                                        >
                                            <Ticket size={16} className="stroke-[2.5px]" />
                                            <span>Register Now</span>
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};