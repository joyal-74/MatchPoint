import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { getTournamentMatches } from "../../../../../features/manager/Tournaments/tournamentThunks";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import EmptyState from "../shared/EmptyState";
import { Trophy, Calendar, Medal, ChevronRight, Search, Share2, Filter } from "lucide-react";
import type { Match } from "../../../../../features/manager/managerTypes";

export default function ResultsTab() {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { matches, fixturesLoading } = useAppSelector(state => state.managerTournaments);
    const [fetched, setFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (id && !fetched) {
            dispatch(getTournamentMatches(id));
            setFetched(true);
        }
    }, [dispatch, id, fetched]);

    if (fixturesLoading) return <LoadingOverlay show />;

    // Filter only completed matches
    const completedMatches = matches?.filter(m => m.status === 'completed') || [];

    // Filter by search
    const filteredMatches = completedMatches.filter(m =>
        m.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.teamB?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (completedMatches.length === 0) {
        return (
            <div className="py-12">
                <EmptyState
                    icon={<Trophy size={48} className="mx-auto mb-4 text-amber-500" />}
                    title="No Results Yet"
                    message="Matches haven't concluded yet."
                    subtitle="Check back once the tournament is underway."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 z-10 pt-2 pb-4 bg-background/95 backdrop-blur-sm">
                <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Match Results
                        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground font-mono">
                            {completedMatches.length}
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                        />
                    </div>
                    <button className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Elastic Scrolling Container */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain pr-2 custom-scrollbar space-y-4 pb-12 min-h-[50vh] max-h-[70vh]">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                        <ResultCard key={match._id} match={match} />
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No results found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Sub-component: Result Card ---

function ResultCard({ match }: { match: Match }) {
    // Helper to get initials
    const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : "??";

    // Formatting date
    const dateStr = match.date
        ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : 'Date TBD';

    // Mocking a winner logic based on context (replace with actual winner field if available)
    // For demo: Assuming teamA is winner if we don't have explicit data
    const winnerName = match.winner || match.teamA;
    const isTeamAWinner = winnerName === match.teamA;
    const isTeamBWinner = winnerName === match.teamB;

    return (
        <div className="group relative bg-card hover:bg-muted/30 border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            {/* Status Bar */}
            <div className="h-1 w-full bg-muted flex">
                <div className={`h-full flex-1 ${isTeamAWinner ? 'bg-amber-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${isTeamBWinner ? 'bg-amber-500' : 'bg-transparent'}`} />
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-center gap-6">

                {/* Meta Info */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-24 gap-2 text-xs text-muted-foreground shrink-0 sm:border-r sm:border-border/50 sm:pr-4">
                    <span className="font-mono px-2 py-1 rounded bg-muted border border-border text-foreground/70">
                        R{match.round}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateStr}
                    </span>
                </div>

                {/* Matchup & Score */}
                <div className="flex-1 w-full grid grid-cols-7 items-center gap-4">

                    {/* Team A */}
                    <div className={`col-span-3 flex flex-col sm:flex-row items-center sm:items-center justify-end gap-3 text-right ${isTeamAWinner ? 'opacity-100' : 'opacity-60'}`}>
                        <div className="flex flex-col items-end">
                            <span className={`font-bold text-sm sm:text-base truncate max-w-[120px] ${isTeamAWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {match.teamA}
                            </span>
                            {isTeamAWinner && (
                                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                                    Winner <Medal size={10} />
                                </span>
                            )}
                        </div>
                        <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 ${isTeamAWinner ? 'border-amber-500 shadow-md shadow-amber-500/20' : 'border-border bg-muted'}`}>
                            {match.teamLogoA ? (
                                <img src={match.teamLogoA} alt={match.teamA} className="w-full h-full object-contain p-0.5" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    {getInitials(match.teamA)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VS / Result Divider */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground mb-1">
                            FT
                        </div>
                    </div>

                    {/* Team B */}
                    <div className={`col-span-3 flex flex-col-reverse sm:flex-row items-center justify-start gap-3 text-left ${isTeamBWinner ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 ${isTeamBWinner ? 'border-amber-500 shadow-md shadow-amber-500/20' : 'border-border bg-muted'}`}>
                            {match.teamLogoB ? (
                                <img src={match.teamLogoB} alt={match.teamB || ''} className="w-full h-full object-contain p-0.5" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                    {getInitials(match.teamB || '')}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className={`font-bold text-sm sm:text-base truncate max-w-[120px] ${isTeamBWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {match.teamB}
                            </span>
                            {isTeamBWinner && (
                                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Medal size={10} /> Winner
                                </span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border/50">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Share Result">
                        <Share2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="View Details">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile Footer Action */}
            <div className="sm:hidden h-10 bg-muted/30 border-t border-border flex items-center justify-center text-xs text-muted-foreground font-medium hover:bg-muted/50 cursor-pointer">
                View Match Details <ChevronRight size={12} className="ml-1" />
            </div>
        </div>
    );
}