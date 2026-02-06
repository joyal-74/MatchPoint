import { useState } from "react";

export const useTournamentModals = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [cancelId, setCancelId] = useState<string | null>(null);


    const handleCancelClick = (id: string) => {
        setCancelId(id);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setCancelId(null);
    };

    return {
        // State
        isConfirmModalOpen,
        isInfoModalOpen,
        cancelId,

        // Actions
        setIsInfoModalOpen,
        handleCancelClick,
        closeConfirmModal
    };
};