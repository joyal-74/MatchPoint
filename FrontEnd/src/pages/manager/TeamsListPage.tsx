import React from "react";
import CreateTeamModal from "../../components/manager/teams/CreateTeamModal";
import EditTeamModal from "../../components/manager/teams/EditTeamModal";
import ManagerLayout from "../layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import SecondaryButton from "../../components/ui/SecondaryButton";
import TeamsHeader from "../../components/manager/teams/TeamsHeader";
import { EmptyTeams } from "../../components/manager/teams/EmptyTeams";
import { TeamsGrid } from "../../components/manager/teams/TeamsGrid";
import { useTeams } from "../../hooks/useTeams";

const TeamsListPage: React.FC = () => {
    const {
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
        handleEditTeamSubmit
    } = useTeams();

    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />

            <div className="text-white mt-8">
                <TeamsHeader onCreateClick={openCreateModal} />

                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">My Teams</h2>
                            <p className="text-neutral-400">{teams.length} teams created</p>
                        </div>
                        <SecondaryButton>View All →</SecondaryButton>
                    </div>

                    {teams.length === 0 && !loading ? (
                        <EmptyTeams onCreate={openCreateModal} />
                    ) : (
                        <TeamsGrid teams={teams} handlers={handlers} />
                    )}
                </section>

                {/* Create Team Modal */}
                <CreateTeamModal
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    onCreateTeam={(formData) =>
                        handleCreateTeam(formData).then(closeCreateModal)
                    }
                    managerId={managerId!}
                />

                {/* Edit Team Modal */}
                {selectedTeam && (
                    <EditTeamModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onEditTeam={handleEditTeamSubmit}
                        teamData={selectedTeam}
                    />
                )}
            </div>
        </ManagerLayout>
    );
};

export default TeamsListPage;