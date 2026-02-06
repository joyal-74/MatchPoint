import { useEffect, useState } from 'react';
import { Trophy, Clock, Award, Activity, Search, Gamepad2 } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { Tournament } from '../../features/manager/managerTypes';
import { fetchTournaments } from '../../features/player/Tournnaments/tournamentThunks';
import { TournamentCard } from './TournamentCard';

type TournamentTab = 'upcoming' | 'ongoing' | 'completed' | 'registered';

const TournamentsPage = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<TournamentTab>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    // Selectors
    const { allTournaments, loading } = useAppSelector((state) => state.playerTournaments);
    const playerId = useAppSelector((state) => state.auth.user?._id);


    // Fetch Logic
    useEffect(() => {
        const fetchParams: any = { status: activeTab };

        if (activeTab === 'registered') {
            if (playerId) {
                fetchParams.playerId = playerId;
                dispatch(fetchTournaments(fetchParams));
            }
        } else {
            dispatch(fetchTournaments(fetchParams));
        }
    }, [activeTab, dispatch, playerId]);

    console.log(allTournaments)

    // Tab Configuration
    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: Clock, color: 'text-blue-500' },
        { id: 'ongoing', label: 'Live Now', icon: Activity, color: 'text-green-500' },
        { id: 'completed', label: 'Past Events', icon: Award, color: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-8">

                {/* --- Hero Section --- */}
                <section className="relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/5 z-0" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
                        {/* Text Content */}
                        <div className="text-center md:text-left space-y-4 max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                                Compete for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Glory</span>
                            </h1>

                            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                                Join the ultimate competitive arena. Battle in local leagues or rise to national stardom.
                            </p>
                        </div>

                        {/* Hero Visual/Stats */}
                        <div className="hidden md:flex items-center gap-6 bg-background/50 backdrop-blur-sm border border-border/50 p-4 rounded-2xl shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Prize Pool</span>
                                <span className="text-2xl font-mono font-bold text-foreground">$150,000+</span>
                            </div>
                            <div className="w-px h-10 bg-border" />
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                                <Gamepad2 size={28} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Controls Toolbar --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20 md:static">
                    {/* Tab Switcher */}

                    <div className="flex w-full md:w-auto items-center gap-3">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search tournaments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-9 pr-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-auto p-1.5 rounded-xl flex overflow-x-auto no-scrollbar gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TournamentTab)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-1 md:flex-none justify-center
                                        ${isActive
                                            ? 'bg-background text-foreground shadow-md ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                                        }
                                    `}
                                >
                                    <Icon size={16} className={`${isActive ? tab.color : 'opacity-70'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Filter */}

                </div>

                {/* --- Main Content Grid --- */}
                <section>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="space-y-3">
                                    <div className="h-48 bg-muted/40 rounded-2xl animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted/40 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-muted/40 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {(!allTournaments || allTournaments.length === 0) ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                                        <Trophy className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        No {activeTab} tournaments found
                                    </h3>
                                    <p className="text-muted-foreground max-w-sm">
                                        We couldn't find any events matching this category. Try switching tabs or check back later.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    {allTournaments.map((tournament: Tournament) => (
                                        <TournamentCard
                                            key={tournament._id}
                                            tournament={tournament}
                                            type={activeTab}
                                        />
                                    ))}
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