import TournamentCard from "./TournamentCard";
import TournamentFilter, { type FilterStatus } from "./TournamentFilter";
import SearchBar from "../../shared/SearchBar";
import type { Tournament } from "../../../features/manager/managerTypes";
import EmptyState from "./TournamentDetails/shared/EmptyState";
import LoadMoreButton from "../../ui/LoadMoreButton";
import EndOfList from "../../shared/EndOfList";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";

interface ExploreTournamentsSectionProps {
    tournaments: Tournament[];
    hasMore: boolean;
    loading: boolean;
    searchQuery: string;
    activeFilter: FilterStatus;
    onLoadMore: () => void;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterStatus) => void;
}

export default function ExploreTournamentsSection({
    tournaments, hasMore, loading, searchQuery, activeFilter, onLoadMore, onSearchChange, onFilterChange }: ExploreTournamentsSectionProps) {

    const navigate = useNavigate();

    return (
        <section className="animate-in fade-in duration-500">

            {/* 1. FILTER BAR (Sticky Optional) */}
            <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm py-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search - expanded width */}
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <SearchBar
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder="Search by name, sport, or city..."
                            className="w-full shadow-sm" 
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden md:inline-flex items-center gap-1">
                            <SlidersHorizontal size={14} /> Filter:
                        </span>
                        <TournamentFilter activeFilter={activeFilter} setActiveFilter={onFilterChange} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* 2. RESULTS GRID */}
            {tournaments.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                onAction={() => navigate(`/manager/tournament/${tournament._id}/explore`)}
                                type="explore"
                                index={index}
                            />
                        ))}
                    </div>

                    {/* 3. PAGINATION */}
                    <div className="mt-12 mb-8 flex justify-center">
                        {hasMore ? (
                            <LoadMoreButton loading={loading} onClick={onLoadMore} />
                        ) : (
                            <EndOfList />
                        )}
                    </div>
                </>
            ) : (
                /* 4. EMPTY STATE */
                <div className="py-20 flex justify-center">
                    <EmptyState
                        title="No tournaments found"
                        message=""
                        subtitle={
                            searchQuery || activeFilter !== "all"
                                ? "We couldn't find any matches. Try adjusting your filters."
                                : "There are no open tournaments at the moment."
                        }
                        icon={
                            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                <Search className="text-muted-foreground/50" size={40} />
                            </div>
                        }
                    />
                </div>
            )}
        </section>
    );
}