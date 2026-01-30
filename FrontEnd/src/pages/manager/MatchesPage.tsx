import { useState, useEffect } from 'react';
import { Search, MapPin, Trophy, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

import { fetchAllMatches } from '../../features/manager/Matches/matchThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import type { Match } from '../../domain/match/types';

const tabs = [
    { id: 'all', label: 'All Matches' },
    { id: 'ongoing', label: 'Live' },
    { id: 'upcoming', label: 'Fixtures' },
    { id: 'completed', label: 'Results' },
] as const;

const MatchesSection = () => {
    const dispatch = useAppDispatch();

    // --- Local UI State ---
    const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 12;

    // --- Redux State ---
    const { allMatches: matches, totalPages, loading, error } = useAppSelector((state) => state.match);

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(fetchAllMatches({
            status: activeTab === 'all' ? undefined : activeTab,
            search: debouncedSearch || undefined,
            page,
            limit
        }));
    }, [dispatch, activeTab, debouncedSearch, page]);

    // Reset page when filters change
    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        setPage(1);
    };

    console.log(matches)

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <section className="p-6 md:px-12 lg:px-16">
                <div className="mx-auto max-w-7xl space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Match Center</h2>
                            <p className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Global Database • Server-Side Synced
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search thousands of matches..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1); // Reset page on search
                                }}
                                className="h-11 w-full rounded-xl border-none bg-muted/50 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="border-b border-border">
                        <div className="flex gap-8 overflow-x-auto pb-px scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative whitespace-nowrap pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    {error ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-600">
                            <AlertCircle size={24} />
                            <p className="font-bold uppercase tracking-tight">Sync Error: {error}</p>
                        </div>
                    ) : loading ? (
                        <div className="flex h-[40vh] flex-col items-center justify-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Querying Database...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {matches.length > 0 ? (
                                    matches.map((match) => <MatchCard key={match._id} match={match} />)
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                                        <Trophy size={48} className="mb-4 opacity-5" />
                                        <p className="text-xs font-black uppercase tracking-widest">No Matches Found</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {(totalPages ?? 0) > 1 && (
                                <div className="flex items-center justify-center gap-4 pt-8">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

// --- Sub-Component: MatchCard ---
const MatchCard = ({ match }: { match: Match }) => {
    const isLive = match.status === 'ongoing';
    
    // Fallback date if string is malformed
    const matchDate = match.date ? new Date(match.date).toLocaleDateString('en-GB') : 'TBD';

    return (
        <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 line-clamp-1 max-w-[80%]">
                    {match.tournamentName || "Tournament"}
                </span>
                {isLive && (
                    <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                )}
            </div>

            <div className="flex items-center justify-between py-2">
                {/* Team A */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden border border-border/50">
                        {match.teamA?.logo ? (
                            <img src={match.teamA.logo} className="w-full h-full object-contain" alt="" />
                        ) : (
                            <span className="text-[10px] font-black">{match.teamA?.name?.substring(0,2) || 'A'}</span>
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-center line-clamp-1">{match.teamA?.name}</span>
                </div>

                <div className="flex flex-col items-center w-1/3">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">VS</span>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden border border-border/50">
                        {match.teamB?.logo ? (
                            <img src={match.teamB.logo} className="w-full h-full object-contain" alt="" />
                        ) : (
                            <span className="text-[10px] font-black">{match.teamB?.name?.substring(0,2) || 'B'}</span>
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-center line-clamp-1">{match.teamB?.name}</span>
                </div>
            </div>

            <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase">
                    <MapPin size={10} /> 
                    <span className="line-clamp-1 max-w-[120px]">{match.venue || "TBD Venue"}</span>
                </div>
                <div className="text-[9px] font-black text-primary uppercase">
                    {matchDate}
                </div>
            </div>
        </div>
    );
};

export default MatchesSection;