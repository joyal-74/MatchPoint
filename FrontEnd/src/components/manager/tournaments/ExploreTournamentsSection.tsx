import TournamentCard from "./TournamentCard";
import TournamentFilter, { type FilterStatus } from "./TournamentFilter";
import SearchBar from "../../shared/SearchBar";
import SecondaryButton from "../../ui/SecondaryButton";
import type { Tournament } from "../../../features/manager/managerTypes";
import EmptyState from "./TournamentDetails/shared/EmptyState";
import LoadMoreButton from "../../ui/LoadMoreButton";
import EndOfList from "../../shared/EndOfList";
import { useNavigate } from "react-router-dom";

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
        <section>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                        Explore Tournaments
                    </h2>
                    <p className="text-neutral-400 text-sm">Discover and join exciting tournaments</p>
                </div>
                <SecondaryButton children={"View All →"} />
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
                <SearchBar
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search tournaments by name, sport, or location..."
                />
                <TournamentFilter activeFilter={activeFilter} setActiveFilter={onFilterChange} />
            </div>

            {tournaments.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {tournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                onAction={() => navigate(`/manager/tournaments/${tournament._id}/explore`)}
                                type="explore"
                                index={index}
                            />
                        ))}
                    </div>

                    {hasMore && (<LoadMoreButton loading={loading} onClick={onLoadMore} />)}

                    {!hasMore && tournaments.length > 0 && (<EndOfList />)}
                </>
            ) : (
                <EmptyState
                    title="No tournaments found"
                    subtitle={searchQuery || activeFilter !== "all" ? "Try adjusting your search or filter criteria"
                        : "There are no tournaments available to explore at the moment"
                    }
                    message="" titleSize="text-lg" messageSize="text-base" subtitleSize="text-sm"
                />
            )}
        </section>
    );
}