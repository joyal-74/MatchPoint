import { CircleDot, Timer, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTournamentMatches } from '../../../../hooks/player/useTournamentData';
import LoadingOverlay from '../../../shared/LoadingOverlay';
import { TeamLogo } from './TeamLogo';

const MatchesTab = () => {
    const { id } = useParams<{ id: string }>();
    const { matches, matchesLoading, matchesError } = useTournamentMatches(id);

    if (matchesError) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                <p>Error loading matches</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-[200px]">
            <LoadingOverlay show={matchesLoading} />
            
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {matches.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                        <Timer className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <span className="text-sm">No matches scheduled yet</span>
                    </div>
                ) : (
                    matches.map((match) => {
                        const isLive = match.status === 'ongoing';
                        const isUpcoming = match.status === 'upcoming';

                        return (
                            <div 
                                key={match._id} 
                                className="group bg-card hover:bg-muted/30 border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                            >
                                {/* --- Top Meta Row --- */}
                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-6 uppercase tracking-wider font-semibold">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] border border-border">
                                            Round {match.round}
                                        </span>
                                        {match.matchNumber && (
                                            <span className="hidden sm:inline">• Match {match.matchNumber}</span>
                                        )}
                                        <span>•</span>
                                        <span>
                                            {match.date ? new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} />
                                        <span className="truncate max-w-[150px]">{match.venue || 'Venue TBD'}</span>
                                    </div>
                                </div>

                                {/* --- Main Match Content (Horizontal) --- */}
                                <div className="flex items-center justify-between relative">
                                    
                                    {/* Team A (Left) */}
                                    <div className="flex-1 flex items-center justify-start gap-3 md:gap-4 overflow-hidden">
                                        <TeamLogo url={match.teamLogoA} name={match.teamA} />
                                        <span className={`text-sm md:text-base font-bold truncate ${match.winner === match.teamA ? 'text-primary' : 'text-foreground'}`}>
                                            {match.teamA}
                                        </span>
                                    </div>

                                    {/* Center: Status Indicator */}
                                    <div className="flex flex-col items-center justify-center shrink-0 px-4 min-w-[80px]">
                                        {isLive ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase animate-pulse bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                                    <CircleDot size={6} fill="currentColor" /> Live
                                                </span>
                                            </div>
                                        ) : isUpcoming ? (
                                            <div className="flex flex-col items-center bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                                                <span className="text-sm font-bold text-foreground tabular-nums">
                                                    {match.date ? new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/50 font-black text-sm bg-muted/30 px-2 py-1 rounded">VS</span>
                                        )}
                                    </div>

                                    {/* Team B (Right) */}
                                    <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 overflow-hidden text-right">
                                        <span className={`text-sm md:text-base font-bold truncate ${match.winner === match.teamB ? 'text-primary' : 'text-foreground'}`}>
                                            {match.teamB}
                                        </span>
                                        <TeamLogo url={match.teamLogoB} name={match.teamB} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MatchesTab;