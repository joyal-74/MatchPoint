import { useState, useEffect } from 'react';
import { Search, MapPin, Trophy, AlertCircle, Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

import { fetchAllMatches } from '../../features/manager/Matches/matchThunks';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useDebounce } from '../../hooks/useDebounce';

const tabs = [
    { id: 'all', label: 'All Matches' },
    { id: 'ongoing', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
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
                <div className="mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-4xl font-black">Match Center</h2>
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
                                    setPage(1);
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
                                    className={`relative whitespace-nowrap pb-4 text-xs font-bold transition-all ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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

export default MatchesSection;

// --- Sub-Component: MatchCard ---
const MatchCard = ({ match }: { match: any }) => {
    const isLive = match.status === 'ongoing';

    const matchDate = match.date
        ? new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        : 'TBD';

    return (
        <div className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer">

            {/* Header: Tournament & Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy size={12} className="text-primary/60" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground line-clamp-1">
                        {match.tournamentName || "Tournament"}
                    </span>
                </div>

                {isLive && (
                    <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-red-600">Live</span>
                    </div>
                )}
            </div>

            {/* Teams Section */}
            <div className="flex items-center justify-between px-2">
                {/* Team A */}
                <div className="flex flex-col items-center gap-3 w-1/3">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-muted to-background rounded-2xl flex items-center justify-center overflow-hidden border border-border/80 shadow-sm">
                            {match.teamLogoA ? (
                                <img src={match.teamLogoA} className="w-10 h-10 object-contain" alt={match.teamA} />
                            ) : (
                                <span className="text-xs font-black opacity-40">{match.teamA.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tight text-center line-clamp-1">{match.teamA}</span>
                </div>

                {/* Center: VS or Score */}
                <div className="flex flex-col items-center justify-center w-1/4">
                    {isLive || match.status === 'completed' ? (
                        <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic">
                            <span>{match.scoreA || 0}</span>
                            <span className="text-muted-foreground/30 text-sm">:</span>
                            <span>{match.scoreB || 0}</span>
                        </div>
                    ) : (
                        <div className="px-3 py-1 rounded-md bg-muted/50 border border-border/50">
                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase">VS</span>
                        </div>
                    )}
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-3 w-1/3">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-muted to-background rounded-2xl flex items-center justify-center overflow-hidden border border-border/80 shadow-sm">
                            {match.teamLogoB ? (
                                <img src={match.teamLogoB} className="w-10 h-10 object-contain" alt={match.teamB} />
                            ) : (
                                <span className="text-xs font-black opacity-40">{match.teamB.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tight text-center line-clamp-1">{match.teamB}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-2 pt-4 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase">
                    <MapPin size={12} className="opacity-70" />
                    <span className="truncate max-w-[100px]">{match.venue || "TBD Venue"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground bg-muted/50 px-2 py-1 rounded-md">
                    <Calendar size={12} className="text-primary" />
                    {matchDate}
                </div>
            </div>
        </div>
    );
};