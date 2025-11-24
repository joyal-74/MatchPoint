import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { approvePlayerRequest, getMyTeamDetails, rejectPlayerRequest, removePlayerFromTeam } from '../../features/manager';
import type { PlayerDetails } from '../../components/manager/teams/Types';

export const useTeamDetails = (teamId?: string) => {
    const dispatch = useAppDispatch();
    const team = useAppSelector((state) => state.manager.selectedTeam);
    const loading = useAppSelector((state) => state.manager.loading);

    const [selectedPlayer, setSelectedPlayer] = useState<PlayerDetails | null>(null);

    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'members' | 'pending'>('members');

    // Fetch team details
    useEffect(() => {
        if (teamId) dispatch(getMyTeamDetails(teamId));
    }, [teamId, dispatch]);

    // Action handlers
    const handleApprove = async (playerId: string) => {
        if (!teamId) return;
        await dispatch(approvePlayerRequest({ teamId, playerId }));
        dispatch(getMyTeamDetails(teamId));
        closeAllModals();
    };

    const handleReject = async (playerId: string) => {
        if (!teamId) return;
        await dispatch(rejectPlayerRequest({ teamId, playerId }));
        dispatch(getMyTeamDetails(teamId));
        closeAllModals();
    };

    const handleRemove = async (playerId: string) => {
        if (!teamId) return;
        await dispatch(removePlayerFromTeam({ teamId, playerId }));
        dispatch(getMyTeamDetails(teamId));
        closeAllModals();
    };

    // Modal control
    const openPlayerDetails = (player: PlayerDetails) => {
        setSelectedPlayer(player);
        setIsPlayerModalOpen(true);
    };

    const openApprovalModal = (player: PlayerDetails) => {
        setSelectedPlayer(player);
        setIsApprovalModalOpen(true);
    };

    const openRemoveModal = (player: PlayerDetails) => {
        setSelectedPlayer(player);
        setIsRemoveModalOpen(true);
    };

    const closeAllModals = () => {
        setIsPlayerModalOpen(false);
        setIsApprovalModalOpen(false);
        setIsRemoveModalOpen(false);
        setSelectedPlayer(null);
    };

    return {
        team,
        loading,

        selectedPlayer,

        isPlayerModalOpen,
        setIsPlayerModalOpen,

        isApprovalModalOpen,
        setIsApprovalModalOpen,

        isRemoveModalOpen,
        setIsRemoveModalOpen,

        activeTab,
        setActiveTab,

        openPlayerDetails,
        openApprovalModal,
        openRemoveModal,

        closeAllModals,

        handleApprove,
        handleReject,
        handleRemove,

        refetchTeam: () => teamId && dispatch(getMyTeamDetails(teamId)),
    };
};
