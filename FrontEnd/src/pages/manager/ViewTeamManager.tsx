import { ArrowLeft } from 'lucide-react';
import ManagerLayout from '../layout/ManagerLayout';
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import PlayerDetailsModal from '../../components/manager/teams/Modal/PlayerDetailsModal';
import PlayerApprovalModal from '../../components/manager/teams/Modal/PlayerApprovalModal';
import TeamInfoCard from '../../components/manager/teams/TeamDetails/TeamInfoCard';
import PlayersSection from '../../components/manager/teams/TeamDetails/PlayersSection';
import { useTeamDetails } from '../../hooks/manager/useTeamDetails';
import RemovePlayerModal from '../../components/manager/teams/Modal/RemovePlayerModal';

const ViewTeamManager = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const {
        team, loading,
        selectedPlayer,
        isPlayerModalOpen, setIsPlayerModalOpen,
        isApprovalModalOpen, setIsApprovalModalOpen,
        isRemoveModalOpen, setIsRemoveModalOpen,
        activeTab, setActiveTab,
        openPlayerDetails,
        openApprovalModal,
        openRemoveModal,
        handleApprove, handleReject,
        handleRemove,
        refetchTeam,
    } = useTeamDetails(teamId);

    if (loading) {
        return (
            <ManagerLayout>
                <LoadingOverlay show={true} />
            </ManagerLayout>
        );
    }

    if (!team) {
        return (
            <ManagerLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm mb-4">Fetching team details...</p>
                    <button
                        onClick={refetchTeam}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />
            <div className="mt-6 w-full space-y-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-3 transition-colors duration-200 text-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Teams</span>
                </button>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <TeamInfoCard team={team} />

                    <PlayersSection
                        team={team}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        openPlayerDetails={openPlayerDetails}
                        openApprovalModal={openApprovalModal}
                        openRemoveModal={openRemoveModal}
                    />
                </div>
            </div>

            {selectedPlayer && (
                <>
                    {isPlayerModalOpen && (
                        <PlayerDetailsModal
                            player={selectedPlayer}
                            isOpen={isPlayerModalOpen}
                            onClose={() => setIsPlayerModalOpen(false)}
                        />
                    )}
                    {isApprovalModalOpen && (
                        <PlayerApprovalModal
                            player={selectedPlayer}
                            isOpen={isApprovalModalOpen}
                            onClose={() => setIsApprovalModalOpen(false)}
                            onApprove={() => handleApprove(selectedPlayer.playerId)}
                            onReject={() => handleReject(selectedPlayer.playerId)}
                        />
                    )}
                    {isRemoveModalOpen && (
                        <RemovePlayerModal
                            player={selectedPlayer}
                            isOpen={isRemoveModalOpen}
                            onClose={() => setIsRemoveModalOpen(false)}
                            onRemove={handleRemove}
                        />
                    )}
                </>
            )}
        </ManagerLayout>
    );
};

export default ViewTeamManager;