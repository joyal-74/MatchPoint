import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { fetchTournaments } from "../../features/player/Tournnaments/tournamentThunks";
import type { Tournament } from "../../features/manager/managerTypes"; 

interface UsePlayerTournamentsResult {
    upcomingTournaments: Tournament[];
    completedTournaments: Tournament[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const usePlayerTournaments = (filterStatus: "upcoming" | "completed"): UsePlayerTournamentsResult => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Use the typed dispatch
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.user?._id);

    // Create a stable fetching function
    const loadData = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const result = await dispatch(fetchTournaments({
                status: filterStatus,
                limit: 100,
                page: 1,
                playerId: userId
            })).unwrap();

            setTournaments(result.tournaments || []);

        } catch (err) {
            console.error("Failed to fetch tournaments", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [dispatch, userId, filterStatus]);

    // Initial Fetch
    useEffect(() => {
        loadData();
    }, [loadData]);

    console.log(tournaments, 'tr')

    // Client-side filtering logic
    const upcomingTournaments = tournaments.filter((t) =>
        [ "upcoming", "ongoing"].includes(t.status)
    );

    const completedTournaments = tournaments.filter((t) =>
        ["completed", "cancelled"].includes(t.status)
    );

    return {
        upcomingTournaments,
        completedTournaments,
        loading,
        error,
        refetch: loadData,
    };
};