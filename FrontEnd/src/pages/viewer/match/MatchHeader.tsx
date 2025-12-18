import { ArrowLeft, MapPin, Trophy, Tv, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Match, Team } from "../../../features/manager/Matches/matchTypes";

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
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-neutral-800 border-2 border-neutral-700 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
            {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm md:text-xl font-bold text-neutral-400">{getInitials(team.name)}</span>
            )}
        </div>
    );

    const handleStreamClick = () => {
        if (isStreamOnline) {
            navigate(`/live/${match._id}/details/stream`);
        }
    };

    return (
        <div className="relative bg-neutral-900 border-b border-neutral-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-neutral-900 to-neutral-900 pointer-events-none" />

            {/* Top Bar: Navigation & Connection */}
            <div className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                <div className=" mx-auto px-20 h-12 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Matches
                    </button>

                    <div className="flex items-center gap-4 text-xs font-mono">
                        <div className={`flex items-center gap-1.5 ${connectionStatus === 'connected' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                            {connectionStatus === 'connected' ? 'REALTIME' : 'CONNECTING'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header Content */}
            <div className="relative z-10 mx-auto px-20 py-6 md:py-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">

                    {/* LEFT: Match Info & Teams */}
                    <div className="flex-1 w-full">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4 text-xs font-medium text-neutral-400">
                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1.5 font-bold tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                LIVE
                            </span>
                            <span className="flex items-center gap-1"><Trophy size={12} /> {match.tournamentName || 'Tournament'}</span>
                            <span className="hidden md:inline">•</span>
                            <span>{match.overs ? `${match.overs} Overs` : 'T20'}</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {match.venue || 'Venue TBD'}</span>
                        </div>

                        {/* Teams Display */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-8">
                            <div className="flex items-center gap-4 md:gap-6">
                                <span className="font-bold text-xl md:text-3xl text-white tracking-tight text-right">{teamA.name}</span>
                                <TeamLogo team={teamA} />
                            </div>

                            <span className="text-neutral-600 font-black text-xl italic opacity-50">VS</span>

                            <div className="flex items-center gap-4 md:gap-6">
                                <TeamLogo team={teamB} />
                                <span className="font-bold text-xl md:text-3xl text-white tracking-tight">{teamB.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Actions (Stream Button) */}
                    <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                        {/* Stream Button */}
                        <button
                            onClick={handleStreamClick}
                            disabled={!isStreamOnline}
                            className={`
                                group relative w-full lg:w-auto overflow-hidden rounded-xl p-[1px] transition-transform active:scale-95
                                ${isStreamOnline ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}
                            `}
                        >
                            <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] ${isStreamOnline ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#ef4444_50%,#E2E8F0_100%)]' : 'bg-neutral-700'}`} />
                            <span className="relative flex h-full w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-neutral-800">
                                {isStreamOnline ? (
                                    <>
                                        <Tv size={18} className="text-red-500" />
                                        WATCH STREAM
                                        <span className="flex h-2 w-2 relative ml-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Tv size={18} className="text-neutral-500" />
                                        STREAM OFFLINE
                                    </>
                                )}
                            </span>
                        </button>

                        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                            <Users size={12} className="text-blue-400" />
                            <span className="text-neutral-300 font-mono">{viewerCount.toLocaleString()}</span> viewers
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};