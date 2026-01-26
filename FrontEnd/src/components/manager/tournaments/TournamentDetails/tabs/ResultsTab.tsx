import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import EmptyState from "../shared/EmptyState";
import { Trophy, Calendar, Medal, ChevronRight, Search } from "lucide-react";
import { getTournamentMatchesResult } from "../../../../../features/manager/Tournaments/tournamentThunks";
// Ensure you import these types from your DTO definition file
import type { TournamentResult, TeamResultSummary } from "../../Types";

export default function ResultsTab() {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { results, fixturesLoading } = useAppSelector(state => state.managerTournaments);
    const [searchTerm, setSearchTerm] = useState("");
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (id && (!fetched || !results)) {
            dispatch(getTournamentMatchesResult(id));
            setFetched(true);
        }
    }, [dispatch, id, fetched, results]);

    if (fixturesLoading) return <LoadingOverlay show />;

    // Cast the results to the correct type safely
    const completedMatches = (results as unknown as TournamentResult[]) || [];

    // Filter by search (accessing nested name properties)
    const filteredMatches = completedMatches.filter(m => 
        m.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.teamB.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain pr-2 custom-scrollbar space-y-4 pb-12 min-h-[50vh] max-h-[70vh]">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                        <ResultCard key={match.matchId} match={match} />
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

function ResultCard({ match }: { match: TournamentResult }) {
    
    // Formatting date
    const dateStr = match.date
        ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : 'Date TBD';

    return (
        <div className="group relative bg-card hover:bg-muted/30 border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
            {/* Status Bar: Green for winner */}
            <div className="h-1 w-full bg-muted flex">
                <div className={`h-full flex-1 transition-colors ${match.teamA.isWinner ? 'bg-green-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 transition-colors ${match.teamB.isWinner ? 'bg-green-500' : 'bg-transparent'}`} />
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-center gap-6">

                {/* Meta Info */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-24 gap-2 text-xs text-muted-foreground shrink-0 sm:border-r sm:border-border/50 sm:pr-4">
                    <span className="font-mono px-2 py-1 rounded bg-muted border border-border text-foreground/70">
                        {typeof match.round === 'number' ? `R${match.round}` : match.round}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateStr}
                    </span>
                </div>

                {/* Matchup & Score */}
                <div className="flex-1 w-full grid grid-cols-7 items-center gap-4">

                    {/* Team A (Left/Top) */}
                    <TeamBlock team={match.teamA} align="right" />

                    {/* Center Result Message */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground mb-1">
                            FT
                        </div>
                        {/* Desktop Result Message */}
                        <span className="hidden sm:block text-[10px] text-center font-medium text-muted-foreground w-20 truncate" title={match.resultMessage}>
                            {match.resultMessage}
                        </span>
                    </div>

                    {/* Team B (Right/Bottom) */}
                    <TeamBlock team={match.teamB} align="left" />

                </div>

                {/* Actions */}
                <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border/50">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View Details">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            
            {/* Mobile Result Message (Visible only on small screens) */}
            <div className="sm:hidden px-5 pb-3 text-center text-xs font-medium text-primary/80 border-t border-dashed border-border/50 pt-3 mt-1">
                {match.resultMessage}
            </div>
        </div>
    );
}

// --- Helper Component for Team Display ---
// This handles the layout for both left and right aligned teams to reduce code duplication
const TeamBlock = ({ team, align }: { team: TeamResultSummary; align: 'left' | 'right' }) => {
    const isWinner = team.isWinner;
    const isRight = align === 'right'; // "Right" means the team is on the left side of VS, pushing content to the right edge

    return (
        <div className={`col-span-3 flex flex-col 
                        ${isRight ? 'items-end sm:items-end' : 'items-start sm:items-start'} 
                        ${isRight ? 'sm:flex-row' : 'sm:flex-row-reverse'} 
                        justify-end gap-3 
                        ${isRight ? 'text-right' : 'text-left'} 
                        ${isWinner ? 'opacity-100' : 'opacity-70'}`}>
            
            <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
                {/* Team Name */}
                <span className={`font-bold text-sm sm:text-base truncate max-w-[120px] ${isWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {team.name}
                </span>
                
                {/* Scores */}
                <div className={`flex items-center gap-1.5 font-mono text-sm mt-0.5 ${isWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <span className="font-bold">{team.runs}/{team.wickets}</span>
                    <span className="text-xs opacity-70">({team.overs})</span>
                </div>

                {/* Winner Badge */}
                {isWinner && (
                    <span className={`text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-1 ${isRight ? 'justify-end' : 'justify-start'}`}>
                       {isRight ? <>Winner <Medal size={10} /></> : <><Medal size={10} /> Winner</>}
                    </span>
                )}
            </div>

            {/* Team Logo */}
            <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 ${isWinner ? 'border-green-500 shadow-md shadow-green-500/20' : 'border-border bg-muted'}`}>
                {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain p-0.5" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {team.name.substring(0, 2).toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
};