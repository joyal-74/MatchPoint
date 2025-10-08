import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { getAllTeams, createTeam, editTeam, deleteTeam } from "../features/manager/managerThunks";
import type { EditTeamPayload, Team } from "../features/manager/managerTypes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "./hooks";

export const useTeams = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { teams, loading, error } = useAppSelector((state) => state.manager);
    console.log(teams)
    
    const { user, isInitialized } = useSelector((state: RootState) => state.auth);
    const managerId = user?._id;

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<EditTeamPayload | null>(null);

    useEffect(() => {
        if (!isInitialized) return;
        if (!managerId) {
            toast.error("Please login to access");
            navigate("/");
            return;
        }
        dispatch(getAllTeams(managerId));
    }, [dispatch, managerId, isInitialized, navigate]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    // Modal handlers
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const openEditModal = (team: Team) => {
        setSelectedTeam({
            teamId: team._id,
            updatedData: {
                name: team.name,
                sport: team.sport,
                status: team.status,
                state: team.state,
                city: team.city,
                managerId: team.managerId,
                description: team.description,
                membersCount : team.membersCount,
                maxPlayers: team.maxPlayers,
                logo : team.logo
            }
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedTeam(null);
    };

    // Team operation handlers
    const handleCreateTeam = (formData: FormData) => dispatch(createTeam(formData));

    const handleEditTeam = (teamId: string, updatedData: FormData) =>
        dispatch(editTeam({ teamId, updatedData }));

    const handleDeleteTeam = (teamId: string) => dispatch(deleteTeam(teamId));
    
    const handleManageMembers = (teamId: string) => console.log("Manage members for team:", teamId);

    // Combined handlers for TeamCard
    const handleEditClick = (teamId: string) => {
        const team = teams.find(t => t._id === teamId);
        if (team) openEditModal(team);
    }

    const handlers = {
        edit: handleEditClick,
        delete: handleDeleteTeam,
        manage: handleManageMembers,
    };

    return {
        teams,
        loading,
        managerId,
        handlers,
        handleCreateTeam,
        isCreateModalOpen,
        isEditModalOpen,
        selectedTeam,
        openCreateModal,
        closeCreateModal,
        closeEditModal,
        handleEditTeamSubmit: handleEditTeam
    };
};