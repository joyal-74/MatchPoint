import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchTeams, joinTeam } from '../../features/player/Teams/teamThunks';
import { getMyAllTeams } from '../../features/player/playerThunks';
import type { Team, Filters } from '../../components/player/Teams/Types';
import type { AuthUser } from '../../types/User';

export const useTeamFilters = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({
        sport: '',
        state: '',
        city: '',
        phase: undefined,
        maxPlayers: undefined
    });

    const updateFilter = useCallback((key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ sport: '', state: '', city: '', phase: undefined, maxPlayers: undefined });
        setSearchQuery('');
    }, []);

    const hasActiveFilters = !!(searchQuery || filters.sport || filters.city || filters.state);

    return { searchQuery, setSearchQuery, filters, updateFilter, clearFilters, hasActiveFilters };
};

// --- Hook 2: Handle Data Fetching & Pagination ---
export const useTeamData = (filters: Filters, searchQuery: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const { allTeams, loading } = useSelector((state: RootState) => state.playerTeams);
    const { user } = useSelector((state: RootState) => state.auth);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery]);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            const params = { ...filters, search: searchQuery, page: currentPage, limit: itemsPerPage };
            dispatch(fetchTeams(params));

            if (user?._id) {
                dispatch(getMyAllTeams(user._id));
            }
        };
        loadData();
    }, [filters, searchQuery, currentPage, dispatch, itemsPerPage, user?._id]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeams = allTeams.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allTeams.length / itemsPerPage);

    return { 
        allTeams, 
        currentTeams, 
        loading, 
        user, 
        pagination: { currentPage, setCurrentPage, totalPages, itemsPerPage, indexOfFirstItem } 
    };
};

// --- Hook 3: Handle Modal & Join Actions ---
export const useTeamActions = (user: AuthUser | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openTeamDetails = useCallback((team: Team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTeam(null);
    }, []);

    const handleJoinTeam = async () => {
        if (!selectedTeam?._id || !user?._id) return;

        try {
            await dispatch(joinTeam({
                playerId: user._id,
                teamId: selectedTeam._id
            })).unwrap();

            toast.success("Team join request submitted");
            closeModal();
            
            dispatch(getMyAllTeams(user._id));
        } catch (error: unknown) {
            console.error("Join error:", error);
            toast.error(typeof error === 'string' ? error : "Failed to join team");
        }
    };

    return { selectedTeam, isModalOpen, openTeamDetails, closeModal, handleJoinTeam };
};