import { useEffect, useState } from "react";
import Navbar from "../../components/manager/Navbar";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ExploreTournamentsSection from "../../components/manager/tournaments/ExploreTournamentsSection";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getExploreTournaments } from "../../features/manager/Tournaments/tournamentThunks";
import type { RootState } from "../../app/store";
import type { FilterStatus } from "../../components/manager/tournaments/TournamentFilter";
import { useDebounce } from "../../hooks/useDebounce";
import { Compass } from "lucide-react";

export default function ExplorePage() {
    const dispatch = useAppDispatch();
    const { exploreTournaments, loading } = useAppSelector((state: RootState) => state.managerTournaments);
    const managerId = useAppSelector((state: RootState) => state.auth.user?._id);

    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 15;

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        if (!managerId) return;

        const fetchExplore = async () => {
            try {
                const result = await dispatch(
                    getExploreTournaments({
                        managerId,
                        limit,
                        page,
                        search: debouncedSearchQuery,
                        filter: activeFilter
                    })
                ).unwrap();
                if (result.length < limit) setHasMore(false);
            } catch (error) {
                console.error("Failed to fetch explore tournaments", error);
            }
        };
        fetchExplore();
    }, [dispatch, managerId, page, debouncedSearchQuery, activeFilter]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [debouncedSearchQuery, activeFilter]);


    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Navbar />

            {loading && page === 1 && <LoadingOverlay show={true} />}

            <main className="flex-1 w-full">

                <div className="relative border-b border-border overflow-hidden bg-background/50">
                    {/* Ambient Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-40" />

                    <div className="relative max-w-4xl mx-auto px-4 py-10 text-center">

                        {/* Minimalist Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-in zoom-in duration-500">
                            <Compass size={14} /> Explore Hub
                        </div>

                        {/* High Impact Headline */}
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 delay-100">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Battleground</span>
                        </h1>

                        {/* Clean Subtext */}
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 delay-200">
                            Join elite leagues and local knockouts. The arena is ready—are you?
                        </p>
                    </div>
                </div>

                {/* === 2. MAIN CONTENT AREA === */}
                <div className="mx-auto px-4 md:px-10 py-2">
                    <ExploreTournamentsSection
                        tournaments={exploreTournaments}
                        loading={loading}
                        hasMore={hasMore}
                        activeFilter={activeFilter}
                        searchQuery={searchQuery}
                        onLoadMore={() => setPage(prev => prev + 1)}
                        onFilterChange={setActiveFilter}
                        onSearchChange={setSearchQuery}
                    />
                </div>
            </main>
        </div>
    );
}