import React, { useEffect } from 'react';
import { Trophy, Zap, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/player/Navbar';
import Footer from '../../components/viewer/Footer';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import TournamentsCard from '../../components/player/TournamentsCard';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchLiveMatches, fetchTournaments } from '../../features/player/Tournnaments/tournamentThunks';
import heroImage from '../../assets/images/cricket-4.png';

export const PlayerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { allTournaments: tournaments, liveMatches, loading } = useAppSelector((state) => state.playerTournaments);

    useEffect(() => {
        dispatch(fetchTournaments({ limit: 3 }));
        dispatch(fetchLiveMatches({ limit: 4, status: 'ongoing' }));
    }, [dispatch]);

    return (
        <>
            <LoadingOverlay show={loading} />

            <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-300">
                <Navbar />

                <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                    {/* --- 1. INTEGRATED HERO SECTION (Borderless Canvas) --- */}
                    <section className="relative overflow-hidden bg-card rounded-[var(--radius)] shadow-sm">
                        {/* Decorative background shape */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-12 z-0" />

                        <div className="grid lg:grid-cols-12 gap-8 p-8 lg:p-14 items-center relative z-10">
                            <div className="lg:col-span-7 space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                    <Zap size={12} className="fill-current" /> Season 2026 Open
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none uppercase italic">
                                    Your Digital <br />
                                    <span className="text-primary">Cricket Arena</span>
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-lg font-medium leading-relaxed">
                                    Track performance, join elite tournaments, and dominate the rankings in the most advanced cricket ecosystem.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={() => navigate('/player/tournaments')}
                                        className="px-8 py-4 bg-primary text-primary-foreground font-black rounded-[var(--radius)] hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 uppercase tracking-tighter italic"
                                    >
                                        Join Tournament <Trophy size={18} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/player/live')}
                                        className="px-8 py-4 bg-secondary text-secondary-foreground font-black rounded-[var(--radius)] hover:bg-accent transition-all uppercase tracking-tighter italic"
                                    >
                                        Live Stream
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-sm">
                                    <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                                    <img
                                        src={heroImage}
                                        alt="Player Preview"
                                        className="relative z-10 w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 3. LIVE MATCH GRID (High Density) --- */}
                    <section className="space-y-6 px-14">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                                On Air Now
                            </h2>
                            <button className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
                                View Match Center
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveMatches.map((match) => (
                                <div
                                    key={match._id}
                                    className="group relative bg-card rounded-[var(--radius)] border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Top Bar: Live Status & Tournament */}
                                    <div className="bg-muted/50 px-5 py-3 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">Live</span>
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-80">
                                            {match?.matchNumber}
                                        </span>
                                    </div>

                                    {/* Main Score Area */}
                                    <div className="p-5 space-y-5">
                                        <div className="space-y-3">
                                            {/* Team A */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                                                        <img src={match.teamA.logo} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="font-bold text-sm tracking-tight uppercase italic">{match.teamA.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-mono font-black text-xl tracking-tighter">{match.scoreA}</span>
                                                    <p className="text-[9px] font-bold text-muted-foreground leading-none">{match.oversA} ov</p>
                                                </div>
                                            </div>

                                            {/* Team B */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                                                        <img src={match.teamB.logo} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="font-bold text-sm tracking-tight uppercase italic">{match.teamB.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-mono font-black text-xl tracking-tighter">{match.scoreB}</span>
                                                    <p className="text-[9px] font-bold text-muted-foreground leading-none">{match.oversB} ov</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tactical Footer (Borderless separation) */}
                                        <div className="pt-4 flex items-center justify-end">
                                            
                                            <div 
                                            onClick={()=> navigate(`/player/live/${match.matchId}/details`)}
                                            className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-tighter group-hover:gap-3 transition-all italic">
                                                View Arena <ChevronRight size={14} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-[var(--radius)] transition-colors pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- 4. TOURNAMENTS SECTION --- */}
                    <section className="bg-card rounded-[var(--radius)] shadow-sm overflow-hidden px-14">
                        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Championships</h2>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Secure your position in the 2026 qualifiers</p>
                            </div>
                            <div className="relative w-full sm:w-72 group">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filter tournaments..."
                                    className="w-full pl-11 pr-4 py-3 bg-muted rounded-[var(--radius)] text-sm font-bold focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        {/* Remove border from the component call as well */}
                        <div className="p-2 pt-0">
                            <TournamentsCard tournaments={tournaments} />
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default PlayerDashboard;