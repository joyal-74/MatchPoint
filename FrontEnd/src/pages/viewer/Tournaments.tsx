import { useEffect, useState, useMemo } from 'react';
import { Trophy, Clock, Award, Activity, Search, Globe, Users, ChevronRight } from 'lucide-react';
import Navbar from '../../components/viewer/Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchTournaments } from '../../features/viewer/viewerThunks';
import { TournamentCard } from './TournamentCard';

type TournamentTab = 'upcoming' | 'ongoing' | 'completed';

const TournamentsPage = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<TournamentTab>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    const { allTournaments, loading } = useAppSelector((state) => state.viewer);

    useEffect(() => {
        dispatch(fetchTournaments({ status: activeTab }));
    }, [activeTab, dispatch]);

    const filteredTournaments = useMemo(() => {
        if (!allTournaments) return [];
        return allTournaments.filter((t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.sport?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allTournaments, searchQuery]);

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: Clock, desc: 'Join the next battle', short: 'Upcoming' },
        { id: 'ongoing', label: 'Active', icon: Activity, desc: 'Events in progress', short: 'Live' },
        { id: 'completed', label: 'Hall of Fame', icon: Award, desc: 'Past champions', short: 'Finished' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Navbar />

            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-10">

                {/* --- Adaptive Header --- */}
                <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-border pb-6 md:pb-8">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] w-fit">
                            <Globe size={12} className="animate-spin-slow" />
                            Global Registry
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase italic">
                            Discover <span className="text-primary">Tournaments</span>
                        </h1>
                        <p className="hidden md:block text-muted-foreground text-sm font-medium max-w-lg">
                            Explore prestigious competitive events. Filter by game, status, or prize pool to find your next favorite league.
                        </p>
                    </div>

                    {/* Search Field - Optimized for mobile touch */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH BY TITLE OR SPORT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 md:h-14 pl-11 pr-4 bg-muted/20 md:bg-muted/30 border border-transparent focus:border-primary/20 focus:bg-card rounded-2xl md:rounded-xl outline-none transition-all font-mono text-[10px] md:text-xs font-bold uppercase tracking-tighter"
                        />
                    </div>
                </header>

                {/* --- Responsive Tournament Navigation --- */}
                <section>
                    {/* Mobile View: Horizontal Scrollable Pills */}
                    <div className="flex md:hidden gap-2 overflow-x-auto no-scrollbar pb-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TournamentTab)}
                                    className={`
                                        flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap border transition-all font-bold text-xs uppercase tracking-widest
                                        ${isActive
                                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'bg-card border-border text-muted-foreground'}
                                    `}
                                >
                                    <Icon size={14} />
                                    {tab.short}
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop View: Grid Action Cards */}
                    <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-6">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TournamentTab)}
                                    className={`
                                        relative flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left group justify-center
                                        ${isActive
                                            ? 'bg-card border-primary shadow-xl shadow-primary/5 ring-1 ring-primary'
                                            : 'bg-card/40 border-border hover:border-primary/50 hover:bg-card'}
                                    `}
                                >
                                    <div className='flex gap-4'>
                                        <div className={`p-3 rounded-2xl w-fit transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                            <tab.icon size={22} />
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {tab.label}
                                            </span>
                                            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase mt-1">
                                                {tab.desc}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* --- Results Info Line --- */}
                <div className="flex items-center gap-4 px-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    <div className="flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-1.5 shrink-0">
                            <Users size={14} className="text-primary" /> {filteredTournaments.length} Events
                        </span>
                        <span className="hidden sm:flex items-center gap-1.5 shrink-0">
                            <Trophy size={14} className="text-primary" /> Pro Circuit
                        </span>
                    </div>
                </div>

                {/* --- Tournament Showcase Grid --- */}
                <section className="pb-10">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[4/5] rounded-[2rem] bg-card border border-border animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredTournaments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {filteredTournaments.map((tournament) => (
                                        <div key={tournament._id} className="group relative">
                                            <TournamentCard
                                                tournament={tournament}
                                                type={activeTab}
                                            />
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                                <div className="bg-primary p-2 rounded-full text-primary-foreground shadow-xl">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 md:py-32 rounded-[2.5rem] border-2 border-dashed border-border/50 bg-muted/5">
                                    <Trophy size={48} strokeWidth={1} className="mb-4 text-muted-foreground/20" />
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter">No tournaments Found</h3>
                                    <button
                                        onClick={() => setActiveTab('upcoming')}
                                        className="mt-6 px-6 py-2.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        RESET FILTERS
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default TournamentsPage;