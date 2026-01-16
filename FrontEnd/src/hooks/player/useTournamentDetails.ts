// src/hooks/useTournamentDetails.ts
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks'; 
import { clearSelectedTournament } from '../../features/player/Tournnaments/tournamnetSlice';
import { tournamentDetails } from '../../features/player/Tournnaments/tournamentThunks';
import {  type Tournament } from '../../features/manager/managerTypes'; 

export const useTournamentDetails = (id?: string) => {
    const dispatch = useAppDispatch();
    const tournament = useAppSelector(state => state.playerTournaments.selectedTournament) as Tournament | null;
    const isLoading = useAppSelector(state => state.playerTournaments.loading);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(clearSelectedTournament());
            dispatch(tournamentDetails(id))
                .unwrap()
                .catch((err) => setError(err.message));
        }
    }, [id, dispatch]);

    return { tournament, isLoading, error };
};