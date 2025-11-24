import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./hooks"; 
import type { RootState } from "../app/store";
import type { FilterStatus } from "../components/manager/tournaments/TournamentFilter";
import { useDebounce } from "./useDebounce";
import { getExploreTournaments, getMyTournaments } from "../features/manager/Tournaments/tournamentThunks";


export const useTournaments = () => {
    const dispatch = useAppDispatch();
    const { myTournaments, exploreTournaments, loading } = useAppSelector((state: RootState) => state.managerTournaments);
    const managerId = useAppSelector((state: RootState) => state.auth.user?._id);

    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState(6);
    const [explorePage, setExplorePage] = useState(1);
    const [exploreLimit] = useState(15);
    const [hasMoreExplore, setHasMoreExplore] = useState(true);
    const [exploreLoading, setExploreLoading] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const showMyTournaments = myTournaments.slice(0, limit);
    const hasMoreMyTournaments = myTournaments.length > limit;

    // Load My Tournaments
    const loadMyTournaments = useCallback(() => {
        if (!managerId) return;
        dispatch(getMyTournaments(managerId));
    }, [dispatch, managerId]);

    // Load Explore Tournaments
    const loadExploreTournaments = useCallback(async () => {
        if (!managerId) return;

        setExploreLoading(true);
        try {
            const result = await dispatch(
                getExploreTournaments({
                    managerId,
                    limit: exploreLimit,
                    page: explorePage,
                    search: debouncedSearchQuery,
                    filter: activeFilter
                })
            ).unwrap();

            setHasMoreExplore(result.length === exploreLimit);
        } catch (error) {
            console.error("Failed to fetch explore tournaments:", error);
            setHasMoreExplore(false);
        } finally {
            setExploreLoading(false);
        }
    }, [dispatch, managerId, explorePage, debouncedSearchQuery, activeFilter, exploreLimit]);

    const handleLoadMore = () => setExplorePage(prev => prev + 1);
    const handleShowAll = () => setLimit(myTournaments.length);

    // Effects
    useEffect(() => {
        loadMyTournaments();
    }, [loadMyTournaments]);

    // Reset explore page when search or filter changes
    useEffect(() => {
        setExplorePage(1);
        setHasMoreExplore(true);
    }, [debouncedSearchQuery, activeFilter]);

    // Load explore tournaments when page, filter, or search changes
    useEffect(() => {
        loadExploreTournaments();
    }, [loadExploreTournaments]);

    return {
        // State
        activeFilter,
        searchQuery,
        showMyTournaments,
        exploreTournaments,
        loading,
        exploreLoading,
        hasMoreMyTournaments,
        hasMoreExplore,
        managerId,

        // Actions
        setActiveFilter,
        setSearchQuery,
        handleLoadMore,
        handleShowAll,
        loadMyTournaments
    };
};
