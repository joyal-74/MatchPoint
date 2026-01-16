import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTournamentMatches, fetchTournamentPointsTable, fetchTournamentStats } from '../../features/player/Tournnaments/tournamentThunks';


// --- 1. MATCHES HOOK ---
export const useTournamentMatches = (tournamentId?: string) => {
    const dispatch = useAppDispatch();
    const { matches, matchesLoading, matchesError } = useAppSelector(state => state.playerTournaments);


    useEffect(() => {
        if (tournamentId) {
            dispatch(fetchTournamentMatches(tournamentId));
        }
    }, [tournamentId, dispatch]);

    return { matches: matches || [], matchesLoading, matchesError };
};

// --- 2. POINTS TABLE HOOK ---
export const useTournamentPointsTable = (tournamentId?: string) => {
    const dispatch = useAppDispatch();
    const {pointsTable, pointsTableError, pointsTableLoading} = useAppSelector(state => state.playerTournaments);

    useEffect(() => {
        if (tournamentId) {
            dispatch(fetchTournamentPointsTable(tournamentId));
        }
    }, [tournamentId, dispatch]);

    return { pointsTable: pointsTable || [], pointsTableError, pointsTableLoading };
};

// --- 3. STATS HOOK ---
export const useTournamentStats = (tournamentId?: string) => {
    const dispatch = useAppDispatch();
    const {stats, statsLoading, statsError} = useAppSelector(state => state.playerTournaments);


    useEffect(() => {
        if (tournamentId) {
            dispatch(fetchTournamentStats(tournamentId));
        }
    }, [tournamentId, dispatch]);

    return { stats, statsLoading, statsError };
};