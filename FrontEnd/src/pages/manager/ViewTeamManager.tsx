import { ArrowLeft, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
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

    // 1. Loading View
    if (loading) {
        return (
            <ManagerLayout>
                <LoadingOverlay show={true} />
            </ManagerLayout>
        );
    }

    // 2. Error / Empty State
    if (!team) {
        return (
            <ManagerLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5 animate-in fade-in zoom-in-95">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/20">
                        <AlertCircle className="w-10 h-10 text-destructive" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">Team not found</h3>
                        <p className="text-muted-foreground">We couldn't fetch the details for this team.</p>
                    </div>
                    <button
                        onClick={refetchTeam}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </ManagerLayout>
        );
    }

    // 3. Main Dashboard View
    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />
            
            <div className="flex flex-col gap-6 mt-4 max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-0">
                
                {/* Navigation Header */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <button
                        onClick={() => navigate('/manager/teams')}
                        className="hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                        <div className="p-1 rounded-md group-hover:bg-muted transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        Teams
                    </button>
                    <ChevronRight size={14} className="opacity-30" />
                    <span className="font-medium text-foreground truncate">{team.name}</span>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                    
                    {/* Left Column: Team Profile (Sidebar style) */}
                    <div className="xl:col-span-1 h-full">
                        <TeamInfoCard team={team} />
                    </div>

                    {/* Right Column: Roster Management (Main content) */}
                    <div className="xl:col-span-3 h-full min-h-[500px]">
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
            </div>

            {/* Modals Layer */}
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