import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Swords, Calendar, Clock, Trophy, Activity, LayoutDashboard } from "lucide-react";
import EmptyState from "../shared/EmptyState";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import { getTournamentMatches } from "../../../../../features/manager/Tournaments/tournamentThunks";
import type { Match } from "../../../../../features/manager/managerTypes";

export default function MatchesTab() {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { matches, fixturesLoading } = useAppSelector(state => state.managerTournaments);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (id && !fetched) {
            dispatch(getTournamentMatches(id));
            setFetched(true);
        }
    }, [dispatch, id, fetched]);

    if (fixturesLoading) return <LoadingOverlay show />;

    if (!matches || matches.length === 0) {
        return (
            <div className="py-12">
                <EmptyState
                    icon={<Swords size={48} className="mx-auto mb-4 text-emerald-500" />}
                    title="No Matches Scheduled"
                    message="The fixture list is currently empty."
                    subtitle="Generate fixtures in the 'Fixtures' tab to see matchups here."
                />
            </div>
        );
    }

    // Group matches by status
    const liveMatches = matches.filter(m => m.status === 'ongoing');
    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const completedMatches = matches.filter(m => m.status === 'completed');

    return (
        <div className="space-y-8 pb-12">
            {/* 1. LIVE MATCHES SECTION */}
            {liveMatches.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 px-1">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-wide">Live Now</h2>
                    </div>
                    <div className="grid gap-4">
                        {liveMatches.map(match => (
                            <MatchRow key={match._id} match={match} isLive />
                        ))}
                    </div>
                </div>
            )}

            {/* 2. UPCOMING MATCHES */}
            {upcomingMatches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-neutral-400">
                        <Calendar size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Upcoming</h2>
                    </div>
                    <div className="grid gap-3">
                        {upcomingMatches.map(match => (
                            <MatchRow key={match._id} match={match} />
                        ))}
                    </div>
                </div>
            )}

            {/* 3. COMPLETED MATCHES */}
            {completedMatches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-neutral-400">
                        <Trophy size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Completed</h2>
                    </div>
                    <div className="grid gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        {completedMatches.map(match => (
                            <MatchRow key={match._id} match={match} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component for individual rows
function MatchRow({ match, isLive = false }: { match: Match; isLive?: boolean }) {

    // Helper for initials
    const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "??";

    return (
        <div className={`
            group relative flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border transition-all duration-300
            ${isLive
                ? "bg-gradient-to-r from-neutral-900 to-neutral-800 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-900/10"
                : "bg-neutral-900/50 border-white/5 hover:bg-neutral-800 hover:border-white/10"
            }
        `}>
            {/* Left: Metadata (Round & Date) */}
            <div className="flex md:flex-col items-center md:items-start justify-between w-full md:w-32 gap-2 text-xs text-neutral-500 shrink-0">
                <span className="font-mono px-2 py-1 rounded bg-white/5 border border-white/5 text-neutral-300">
                    {match.round}
                </span>
                <div className="flex items-center gap-1.5">
                    {isLive ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Activity size={12} /> Live
                        </span>
                    ) : (
                        <>
                            <Clock size={12} />
                            {match.date ? new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                        </>
                    )}
                </div>
            </div>

            {/* Center: Teams */}
            <div className="flex-1 w-full grid grid-cols-7 items-center gap-2">

                {/* Team A (Right Aligned) */}
                <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                    <span className="font-semibold text-white truncate hidden md:block">{match.teamA}</span>
                    <span className="font-semibold text-white md:hidden">{getInitials(match.teamA)}</span>

                    {match.teamLogoA ? (
                        <img src={match.teamLogoA} alt={match.teamA} className="w-8 h-8 object-contain rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 border border-white/5">
                            {getInitials(match.teamA)}
                        </div>
                    )}
                </div>

                {/* VS / Score */}
                <div className="col-span-1 flex justify-center">
                    <div className="px-2 py-1 rounded-md bg-black/40 border border-white/10 text-xs font-mono font-bold text-neutral-400">
                        VS
                    </div>
                </div>

                {/* Team B (Left Aligned) */}
                <div className="col-span-3 flex items-center justify-start gap-3 text-left">
                    {match.teamLogoB ? (
                        <img src={match.teamLogoB} alt={match.teamB || 'bye'} className="w-8 h-8 object-contain rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 border border-white/5">
                            {getInitials(match.teamB ?? 'bye')}
                        </div>
                    )}
                    <span className="font-semibold text-white truncate hidden md:block">{match.teamB}</span>
                    <span className="font-semibold text-white md:hidden">{getInitials(match.teamB || 'bye')}</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
                <Link
                    to={`/manager/match/${match._id}/dashboard`}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${isLive
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                            : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5"
                        }
                    `}
                >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                    <ArrowRight size={16} className={`transition-transform duration-300 ${isLive ? 'group-hover:translate-x-1' : ''}`} />
                </Link>
            </div>
        </div>
    );
}