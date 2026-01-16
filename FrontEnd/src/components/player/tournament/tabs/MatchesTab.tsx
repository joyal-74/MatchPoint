import { CircleDot, Timer } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTournamentMatches } from '../../../../hooks/player/useTournamentData';
import LoadingOverlay from '../../../shared/LoadingOverlay';

const MatchesTab = () => {
    const { id } = useParams<{ id: string }>();
    const { matches, matchesLoading, matchesError } = useTournamentMatches(id);

    if (matchesError) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center text-muted-foreground">
                    <div className="text-sm">Error loading matches:</div>
                    <div className="text-xs mt-1">{matchesError}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay show={matchesLoading} />
            <div className="space-y-4 animate-in fade-in duration-300">
                {matches.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Timer className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No matches available yet</div>
                    </div>
                ) : (
                    matches.map((match, idx) => {
                        // Map status for display
                        const displayStatus = match.status === 'ongoing' ? 'live' : match.status;
                        // Construct toss string if available
                        const toss = match.tossWinner && match.tossDecision
                            ? `${match.tossWinner} won toss & chose to ${match.tossDecision}`
                            : null;
                        // Construct result string if completed
                        const result = match.status === 'completed' && match.winner
                            ? `${match.winner} won` // Enhance with details if stats provide more (e.g., margin)
                            : null;

                        return (
                            <div key={match._id || idx} className="bg-card border border-border rounded-xl hover:bg-muted/30 transition-colors overflow-hidden">
                                <div className="bg-muted/30 px-4 py-2 flex items-center justify-between text-xs border-b border-border">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground/80">Round {match.round}</span>
                                        <span className="text-muted-foreground">• {match.date ? new Date(match.date).toLocaleDateString() : 'TBD'}</span>
                                        {match.venue && <span className="text-muted-foreground">• {match.venue}</span>}
                                    </div>
                                    {toss && <span className="text-muted-foreground hidden md:block italic">{toss}</span>}
                                </div>
                                <div className="p-4 md:p-6 grid grid-cols-3 items-center gap-4">
                                    <div className="flex flex-col items-center md:items-start gap-2"> {/* Removed batting opacity as not in type */}
                                        <div className="flex items-center gap-3">
                                            {/* Use logo if available, fallback to initial */}
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0">
                                                {match.teamA.logo ? (
                                                    <img
                                                        src={match.teamA.logo}
                                                        alt={match.teamA.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                        {match.teamA.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm md:text-lg font-bold text-center md:text-left hidden md:block">{match.teamA.name}</span>
                                        </div>
                                        <span className="text-xs font-bold md:hidden">{match.teamA.name}</span>
                                        {match.scoreA ? (
                                            <div className="text-center md:text-left">
                                                <span className="text-xl md:text-2xl font-bold font-mono block">{match.scoreA}</span>
                                                <span className="text-xs text-muted-foreground font-mono">({match.oversA} ov)</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Yet to bat</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center justify-center text-center">
                                        {displayStatus === 'live' && (
                                            <div className="mb-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                                                    <CircleDot className="w-2 h-2 fill-current" /> LIVE
                                                </span>
                                                {/* Target not in type; remove or derive from stats if needed */}
                                            </div>
                                        )}
                                        {displayStatus === 'upcoming' && (
                                            <div className="flex flex-col items-center gap-1 text-primary">
                                                <Timer className="w-5 h-5" />
                                                <span className="text-sm font-bold">
                                                    {match.date ? new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                                </span>
                                            </div>
                                        )}
                                        {result && <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-2">{result}</p>}
                                        <div className="text-xs text-muted-foreground mt-1">vs</div>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-2"> {/* Removed batting opacity as not in type */}
                                        <div className="flex flex-row-reverse items-center gap-3">
                                            {/* Use logo if available, fallback to initial */}
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0">
                                                {match.teamB.logo ? (
                                                    <img
                                                        src={match.teamB.logo}
                                                        alt={match.teamB.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                                                        {match.teamB.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm md:text-lg font-bold text-center md:text-right hidden md:block">{match.teamB.name}</span>
                                        </div>
                                        <span className="text-xs font-bold md:hidden">{match.teamB.name}</span>
                                        {match.scoreB ? (
                                            <div className="text-center md:text-right">
                                                <span className="text-xl md:text-2xl font-bold font-mono block">{match.scoreB}</span>
                                                <span className="text-xs text-muted-foreground font-mono">({match.oversB} ov)</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Yet to bat</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

export default MatchesTab;