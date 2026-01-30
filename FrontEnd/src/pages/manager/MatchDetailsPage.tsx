import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, Share2, Activity, CircleDot, Loader2 } from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

import { loadMatchDashboard } from '../../features/manager/Matches/matchThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { BattingStats, BowlingStats } from '../../domain/match/types';

const ScorecardRow = ({ batter, isHeader = false }: { batter?: Partial<BattingStats>; isHeader?: boolean }) => {
    if (isHeader) {
        return (
            <div className="flex items-center justify-between border-b border-border px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30">
                <div className="w-5/12">Batter</div>
                <div className="w-1/12 text-center">R</div>
                <div className="w-1/12 text-center">B</div>
                <div className="w-1/12 text-center hidden sm:block">4s</div>
                <div className="w-1/12 text-center hidden sm:block">6s</div>
                <div className="w-2/12 text-right">SR</div>
            </div>
        );
    }
    if (!batter) return null;
    return (
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 text-sm hover:bg-muted/10 transition-colors">
            <div className="w-5/12 flex flex-col">
                <span className="font-bold text-foreground truncate">{batter.playerId || "Unknown"}</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">{!batter.out || 'not out'}</span>
            </div>
            <div className="w-1/12 text-center font-black text-foreground">{batter.runs}</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs">{batter.balls}</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs hidden sm:block">{batter.fours}</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs hidden sm:block">{batter.sixes}</div>
            <div className="w-2/12 text-right text-muted-foreground font-mono text-xs">{batter.strikeRate}</div>
        </div>
    );
};

const BowlingRow = ({ bowler, isHeader = false }: { bowler?: Partial<BowlingStats>; isHeader?: boolean }) => {
    if (isHeader) {
        return (
            <div className="flex items-center justify-between border-b border-border px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30">
                <div className="w-5/12">Bowler</div>
                <div className="w-1/12 text-center">O</div>
                <div className="w-1/12 text-center">M</div>
                <div className="w-1/12 text-center">R</div>
                <div className="w-1/12 text-center font-bold">W</div>
                <div className="w-2/12 text-right">ECO</div>
            </div>
        );
    }
    if (!bowler) return null;
    return (
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 text-sm hover:bg-muted/10 transition-colors">
            <div className="w-5/12 font-bold text-foreground">{bowler.playerId}</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs">{bowler.ballsBowled}</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs">0</div>
            <div className="w-1/12 text-center text-muted-foreground text-xs">{bowler.runsConceded}</div>
            <div className="w-1/12 text-center font-black text-primary">{bowler.wickets}</div>
            <div className="w-2/12 text-right text-muted-foreground font-mono text-xs">{bowler.economy}</div>
        </div>
    );
};

const MatchDetailsPage = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<'scorecard' | 'squads' | 'info'>('scorecard');
    const [selectedInnings, setSelectedInnings] = useState<1 | 2>(1);

    const { currentMatch: match, loading, error } = useAppSelector((state) => state.match);

    useEffect(() => {
        if (matchId) dispatch(loadMatchDashboard(matchId));
    }, [dispatch, matchId]);

    // Derived Logic for Scores
    const isOngoing = match?.status === 'ongoing';

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing Scorecard...</span>
        </div>
    );

    if (error || !match) return (
        <div className="h-screen flex items-center justify-center p-6 text-center">
            <div className="space-y-4">
                <p className="text-destructive font-bold uppercase tracking-tight">{error || "Match not found"}</p>
                <button onClick={() => navigate(-1)} className="text-sm font-bold underline">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground pb-12">
            <Navbar />

            {/* --- Hero Header --- */}
            <div className="relative bg-card border-b border-border shadow-sm">
                <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronLeft size={16} /> Back
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                            {match.tournamentName} • Match {match.matchNumber}
                        </span>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                            <Share2 size={16} />
                        </button>
                    </div>

                    {/* Scoreboard Main */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6">
                        {/* Team A */}
                        <div className="flex flex-col items-center gap-3 md:items-start md:flex-row md:gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted overflow-hidden border border-border">
                                {match.teamA.logo ? <img src={match.teamA.logo} alt="" className="w-full h-full object-cover" /> : '🏏'}
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-xs font-black uppercase tracking-widest opacity-40">{match.teamA.name}</h2>
                                <div className="mt-1 flex items-baseline justify-center gap-2 md:justify-start">
                                    <span className="text-3xl font-black text-foreground">185/6</span>
                                    <span className="text-xs font-bold text-muted-foreground">(20.0)</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Area */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            {isOngoing ? (
                                <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black text-red-600 animate-pulse border border-red-500/20">
                                    <CircleDot size={10} className="fill-current" /> LIVE
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {match.status}
                                </div>
                            )}
                            <p className="text-xs font-black text-primary uppercase tracking-tight italic">Match in progress</p>
                            <span className="text-[10px] font-bold uppercase text-muted-foreground/40 tracking-widest">Target: 186</span>
                        </div>

                        {/* Team B */}
                        <div className="flex flex-col items-center gap-3 md:items-end md:flex-row-reverse md:gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted overflow-hidden border border-border">
                                {match.teamB.logo ? <img src={match.teamB.logo} alt="" className="w-full h-full object-cover" /> : '🏏'}
                            </div>
                            <div className="text-center md:text-right">
                                <h2 className="text-xs font-black uppercase tracking-widest opacity-40">{match.teamB.name}</h2>
                                <div className="mt-1 flex items-baseline justify-center gap-2 md:justify-end">
                                    <span className="text-4xl font-black text-primary">172/4</span>
                                    <span className="text-xs font-bold text-muted-foreground">(18.4)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mx-auto max-w-5xl px-4 md:px-6">
                    <div className="flex gap-8 border-t border-border">
                        {['scorecard', 'squads', 'info'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`relative pb-3 pt-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <main className="mx-auto max-w-5xl px-4 pt-6 md:px-6">

                {activeTab === 'scorecard' && (
                    <div className="space-y-6">
                        {/* Innings Switcher */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedInnings(1)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedInnings === 1 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card border-border'}`}
                            >
                                1st Innings
                            </button>
                            <button
                                onClick={() => setSelectedInnings(2)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedInnings === 2 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card border-border'}`}
                            >
                                2nd Innings
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Activity size={14} /> Batting
                                        </h3>
                                    </div>
                                    <div className="bg-card">
                                        <ScorecardRow isHeader />
                                        <BowlingRow isHeader />
                                        <div className="p-8 text-center text-[10px] font-bold text-muted-foreground uppercase italic tracking-widest">
                                            Live Stats Syncing...
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                    <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Match Venue</h4>
                                    <div className="flex gap-3">
                                        <MapPin size={18} className="text-primary shrink-0" />
                                        <span className="text-xs font-bold leading-relaxed">{match.venue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'squads' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[match.teamA, match.teamB].map((team, idx) => (
                            <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                                <div className="bg-muted/30 p-4 border-b border-border flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-xs">{team.name.substring(0, 1)}</div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest">{team.name} Squad</h3>
                                </div>
                                <ul className="divide-y divide-border/50">
                                    {team.members?.map((player, i) => (
                                        <li key={i} className="flex items-center justify-between px-5 py-3 hover:bg-muted/10 transition-colors">
                                            <span className="text-xs font-bold">{player.name}</span>
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase">{player.role || 'Player'}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MatchDetailsPage;