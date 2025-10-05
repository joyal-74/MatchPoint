import { useState } from "react";
import type { Tournament } from "../features/manager/managerTypes";

export const useTournamentModals = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
    const [cancelId, setCancelId] = useState<string | null>(null);

    const handleEditClick = (tournament: Tournament) => {
        setEditingTournament(tournament);
        setIsEditModalOpen(true);
    };

    const handleCancelClick = (id: string) => {
        setCancelId(id);
        setIsConfirmModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTournament(null);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setCancelId(null);
    };

    return {
        // State
        isCreateModalOpen,
        isEditModalOpen,
        isConfirmModalOpen,
        isInfoModalOpen,
        editingTournament,
        cancelId,

        // Actions
        setIsCreateModalOpen,
        setIsInfoModalOpen,
        handleEditClick,
        handleCancelClick,
        closeEditModal,
        closeConfirmModal
    };
};