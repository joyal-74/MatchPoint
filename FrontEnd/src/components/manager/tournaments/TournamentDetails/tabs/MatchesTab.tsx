import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Link, useParams } from "react-router-dom";
import { 
    Swords, Calendar, Clock, Trophy, Activity, 
    LayoutDashboard, Eye, ChevronRight 
} from "lucide-react";
import EmptyState from "../shared/EmptyState";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import { getTournamentMatches } from "../../../../../features/manager/Tournaments/tournamentThunks";
import type { Match } from "../../../../../features/manager/managerTypes";

export default function MatchesTab() {
    const dispatch = useAppDispatch();
    const { id, type } = useParams(); 
    const { matches, fixturesLoading } = useAppSelector(state => state.managerTournaments);
    const [fetched, setFetched] = useState(false);

    const isManager = type === 'manage';

    useEffect(() => {
        if (id && !fetched) {
            dispatch(getTournamentMatches(id));
            setFetched(true);
        }
    }, [dispatch, id, fetched]);

    if (fixturesLoading) return <LoadingOverlay show />;

    if (!matches || matches.length === 0) {
        return (
            <div className="py-12 animate-in fade-in zoom-in-95 duration-500">
                <EmptyState
                    icon={<Swords size={48} className="mx-auto mb-4 text-primary" />}
                    title="No Matches Scheduled"
                    message="The match list is currently empty try create fixture."
                    subtitle={isManager ? "Generate fixtures in the 'Fixtures' tab to see matchups here." : "Check back later for the match schedule."}
                />
            </div>
        );
    }

    // Group matches by status
    const liveMatches = matches.filter(m => m.status === 'ongoing');
    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const completedMatches = matches.filter(m => m.status === 'completed');

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            
            {/* 1. LIVE MATCHES SECTION */}
            {liveMatches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground tracking-wide">Live Now</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {liveMatches.map(match => (
                            <MatchRow key={match._id} match={match} isLive isManager={isManager} />
                        ))}
                    </div>
                </div>
            )}

            {/* 2. UPCOMING MATCHES */}
            {upcomingMatches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-muted-foreground">
                        <Calendar size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Upcoming</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {upcomingMatches.map(match => (
                            <MatchRow key={match._id} match={match} isManager={isManager} />
                        ))}
                    </div>
                </div>
            )}

            {/* 3. COMPLETED MATCHES */}
            {completedMatches.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-muted-foreground">
                        <Trophy size={18} />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Completed</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                        {completedMatches.map(match => (
                            <MatchRow key={match._id} match={match} isManager={isManager} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Sub-component ---

function MatchRow({ match, isLive = false, isManager = false }: { match: Match; isLive?: boolean; isManager: boolean }) {

    // Helper for initials
    const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "??";

    return (
        <div className={`
            group relative flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border transition-all duration-300
            ${isLive
                ? "bg-gradient-to-r from-card to-muted border-green-500/50 hover:border-green-500/80 shadow-lg shadow-green-500/10"
                : "bg-card border-border hover:bg-muted/30 hover:border-primary/30"
            }
        `}>

            {/* Top/Left: Match Info */}
            <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-auto gap-2 text-xs text-muted-foreground shrink-0">
                <span className="font-mono px-2 py-1 rounded bg-muted border border-border text-foreground/70">
                    R{match.round}
                </span>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {isLive ? (
                        <span className="text-green-500 font-bold flex items-center gap-1">
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

            {/* Center: Teams (Expanded to take available space) */}
            <div className="flex-1 w-full grid grid-cols-7 items-center gap-2">

                {/* Team A (Right Aligned) */}
                <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                    <span className="font-semibold text-foreground text-sm truncate hidden sm:block max-w-[100px] xl:max-w-[140px]" title={match.teamA}>
                        {match.teamA}
                    </span>
                    <span className="font-semibold text-foreground sm:hidden">{getInitials(match.teamA)}</span>

                    <div className="relative w-8 h-8 rounded-full bg-muted overflow-hidden ring-1 ring-border shrink-0">
                        {match.teamLogoA ? (
                            <img src={match.teamLogoA} alt={match.teamA} className="w-full h-full object-contain p-0.5" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {getInitials(match.teamA)}
                            </div>
                        )}
                    </div>
                </div>

                {/* VS Badge */}
                <div className="col-span-1 flex justify-center">
                    <div className="w-7 h-5 flex items-center justify-center rounded bg-muted/80 border border-border text-[10px] font-mono font-bold text-muted-foreground">
                        VS
                    </div>
                </div>

                {/* Team B (Left Aligned) */}
                <div className="col-span-3 flex items-center justify-start gap-3 text-left">
                    <div className="relative w-8 h-8 rounded-full bg-muted overflow-hidden ring-1 ring-border shrink-0">
                        {match.teamLogoB ? (
                            <img src={match.teamLogoB} alt={match.teamB ?? ''} className="w-full h-full object-contain p-0.5" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {getInitials(match.teamB ?? '')}
                            </div>
                        )}
                    </div>

                    <span className="font-semibold text-foreground text-sm truncate hidden sm:block max-w-[100px] xl:max-w-[140px]" title={match.teamB ?? 'Bye'}>
                        {match.teamB ?? ''}
                    </span>
                    <span className="font-semibold text-foreground sm:hidden">{getInitials(match.teamB ?? '')}</span>
                </div>
            </div>

            {/* Right: Actions (Dynamic based on Role) */}
            <div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
                {isManager ? (
                    /*  */
                    <Link
                        to={`/manager/match/${match._id}/dashboard`}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                            ${isLive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                                : "bg-background border border-border hover:bg-muted text-foreground"
                            }
                        `}
                    >
                        <LayoutDashboard size={14} />
                        <span className="hidden xl:inline">Dashboard</span>
                        <span className="xl:hidden">Manage</span>
                    </Link>
                ) : (
                    /*  */
                    <Link
                        to={`/match/${match._id}/view`}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all group/btn
                            ${isLive
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 animate-pulse-slow"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }
                        `}
                    >
                        {isLive ? <Eye size={14} /> : <ChevronRight size={14} />}
                        <span>{isLive ? "Watch Live" : "View Match"}</span>
                    </Link>
                )}
            </div>
        </div>
    );
}