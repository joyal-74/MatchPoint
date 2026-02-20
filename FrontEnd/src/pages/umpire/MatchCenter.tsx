import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { Calendar, CheckCircle2, Clock, ExternalLink, Map, MapPin, PlayCircle, Timer } from 'lucide-react';
import Navbar from '../../components/umpire/Navbar';
import { fetchAllMatches } from '../../features/umpire/umpireThunks';
import { useNavigate } from 'react-router-dom';

const UmpireMatchDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'upcoming' | 'completed'>('upcoming');

    const { allMatches: matches, loading } = useAppSelector((state) => state.umpire);
    const userId = useAppSelector((state) => state.auth.user?._id);

    useEffect(() => {
        if (userId) {
            dispatch(fetchAllMatches(userId));
        }
    }, [dispatch, userId]);

    const ongoingMatch = useMemo(() =>
        matches.find(m => m.status === 'ongoing'),
        [matches]);

    const libraryMatches = useMemo(() =>
        matches.filter(m => m.status === activeFilter),
        [matches, activeFilter]);

    if (loading && matches.length === 0) {
        return <div className="flex h-screen items-center justify-center font-black uppercase tracking-widest opacity-20">Loading Assignments...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 mt-12">
            <Navbar />

            <main className="mx-auto p-4 md:p-8 space-y-12">

                {/* --- SECTION 1: THE FEATURED ONGOING MATCH (Conditional Rendering) --- */}
                {ongoingMatch ? (
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Match Session</h2>
                        </div>

                        <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border shadow-xl p-6 md:p-10 transition-all">
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 blur-[100px] pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                            {ongoingMatch.oversLimit} OVERS
                                        </span>
                                        <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Map size={12} /> {ongoingMatch.venue?.split(',')[0]}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-black border-2 border-primary shadow-inner">
                                                {(ongoingMatch.teamA as string)?.[0] || 'A'}
                                            </div>
                                            <p className="text-xs font-bold uppercase">{(ongoingMatch.teamA as string) || 'Team A'}</p>
                                        </div>
                                        <span className="text-3xl font-black italic text-muted/30 tracking-tighter">VS</span>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-black border border-border">
                                                {(ongoingMatch.teamB as string)?.[0] || 'B'}
                                            </div>
                                            <p className="text-xs font-bold uppercase">{(ongoingMatch.teamB as string) || 'Team B'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        <h3 className="text-3xl font-black tracking-tighter">
                                            {ongoingMatch.innings1?.runs ?? 0}/{ongoingMatch.innings1?.wickets ?? 0}
                                            <span className="text-sm ml-2 text-muted-foreground">({Math.floor(ongoingMatch.innings1?.legalBalls ?? 0 / 6)}.{ongoingMatch.innings1?.legalBalls ?? 0 % 6} ov)</span>
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground font-medium italic">Innings {ongoingMatch.currentInnings} in progress</p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-start md:items-end gap-6">
                                    <div className="space-y-2 md:text-right">
                                        <div className="flex items-center md:justify-end gap-2 text-muted-foreground text-xs font-medium">
                                            <MapPin size={14} className="text-primary" /> {ongoingMatch.venue?.split(',')[1] || "Field 1"}
                                        </div>
                                        <div className="flex items-center md:justify-end gap-2 text-muted-foreground text-xs font-medium">
                                            <Clock size={14} className="text-primary" /> Started: {new Date(ongoingMatch.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <button 
                                    onClick={()=> navigate(`/umpire/matches/${ongoingMatch._id}/live-score`)}
                                    className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                                        Resume Scoring <PlayCircle size={18} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                {/* --- SECTION 2: MATCH LIBRARY --- */}
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Match Library</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Review schedules and past results</p>
                        </div>

                        <div className="flex p-1 bg-muted rounded-full border border-border">
                            {(['upcoming', 'completed'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tab
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {libraryMatches.length > 0 ? libraryMatches.map((m) => (
                            <div key={m._id} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[9px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-widest border border-border">
                                        {m.oversLimit} OVERS
                                    </span>
                                    {m.status === 'completed'
                                        ? <CheckCircle2 size={16} className="text-green-500/50" />
                                        : <Timer size={16} className="text-muted-foreground" />
                                    }
                                </div>

                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <span className="text-[12px] font-black uppercase tracking-tight text-center truncate w-20">
                                        {(m.teamA as string) || 'T1'}
                                    </span>
                                    <span className="text-[10px] font-black text-muted/40 italic">VS</span>
                                    <span className="text-[12px] font-black uppercase tracking-tight text-center truncate w-20">
                                        {(m.teamB as string)|| 'T2'}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                        <Calendar size={12} className="text-primary" />
                                        {new Date(m.date).toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                        <MapPin size={12} className="text-primary" /> {m.venue?.split(',')[0]}
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-3 rounded-xl bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex items-center justify-center gap-2">
                                    View Details <ExternalLink size={12} />
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                                No {activeFilter} matches found
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UmpireMatchDashboard;