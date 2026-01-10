import Navbar from "../../components/manager/Navbar";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import CreateTournamentModal from "../../components/manager/tournaments/TournamentModal/CreateTournamentModal";
import EditTournamentModal from "../../components/manager/tournaments/TournamentModal/EditTournamentModal";
import ConfirmModal from "../../components/shared/modal/ConfirmModal";
import PrizeInfoModal from "../../components/manager/tournaments/TournamentModal/PriceInfoModal";
import TournamentsHeader from "../../components/manager/tournaments/TournamentsHeader";
import MyTournamentsSection from "../../components/manager/tournaments/MyTournamentsSection";
import ExploreTournamentsSection from "../../components/manager/tournaments/ExploreTournamentsSection";
import DashboardStats from "../../components/manager/tournaments/DashboardStats";
import { useTournaments } from "../../hooks/useTournaments";
import { useAppDispatch } from "../../hooks/hooks";
import { cancelTournament } from "../../features/manager/Tournaments/tournamentThunks";
import { useTournamentModals } from "../../hooks/useTournamentModals";

export default function TournamentsPage() {
    const dispatch = useAppDispatch();
    
    const {
        activeFilter,
        searchQuery,
        showMyTournaments,
        exploreTournaments,
        loading,
        exploreLoading,
        hasMoreMyTournaments,
        hasMoreExplore,
        managerId,
        setActiveFilter,
        setSearchQuery,
        handleLoadMore,
        handleShowAll
    } = useTournaments();

    const {
        isCreateModalOpen,
        isEditModalOpen,
        isConfirmModalOpen,
        isInfoModalOpen,
        editingTournament,
        cancelId,
        setIsCreateModalOpen,
        setIsInfoModalOpen,
        handleEditClick,
        handleCancelClick,
        closeEditModal,
        closeConfirmModal
    } = useTournamentModals();

    const handleConfirmCancel = (reason: string) => {
        if (cancelId) {
            dispatch(cancelTournament({ cancelId, reason }));
        }
        closeConfirmModal();
    };

    return (
        <>
            <LoadingOverlay show={loading} />
            <Navbar />

            {/* Main Container: Adapted for Theme & Fixed Navbar */}
            <div className="min-h-screen bg-background text-foreground p-6 md:p-8 pt-24 lg:px-12 transition-colors duration-300">
                
                {/* 1. Rich Header Section */}
                <TournamentsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

                {/* 2. Key Metrics / Stats Dashboard */}
                <div className="mt-8">
                    <DashboardStats 
                        myTournamentsCount={showMyTournaments.length} 
                        totalExploreCount={exploreTournaments.length}
                    />
                </div>

                

                <div className="space-y-12 mt-8">
                    {/* 3. My Tournaments (Your Workspace) */}
                    <MyTournamentsSection
                        tournaments={showMyTournaments}
                        hasMore={hasMoreMyTournaments}
                        onShowAll={handleShowAll}
                        onEdit={handleEditClick}
                        onCancel={handleCancelClick}
                        onCreate={() => setIsCreateModalOpen(true)}
                    />

                    {/* Semantic Divider */}
                    <div className="border-t border-border pt-8">
                         {/* 4. Explore Section */}
                        <ExploreTournamentsSection
                            tournaments={exploreTournaments}
                            hasMore={hasMoreExplore}
                            loading={exploreLoading}
                            searchQuery={searchQuery}
                            activeFilter={activeFilter}
                            onLoadMore={handleLoadMore}
                            onSearchChange={setSearchQuery}
                            onFilterChange={setActiveFilter}
                        />
                    </div>
                </div>

                {/* Modals */}
                <CreateTournamentModal
                    isOpen={isCreateModalOpen}
                    managerId={managerId!}
                    onClose={() => setIsCreateModalOpen(false)}
                    onShowPrizeInfo={() => setIsInfoModalOpen(true)}
                />

                {editingTournament && (
                    <EditTournamentModal
                        isOpen={isEditModalOpen}
                        managerId={managerId!}
                        tournament={editingTournament}
                        onClose={closeEditModal}
                        onShowPrizeInfo={() => setIsInfoModalOpen(true)}
                    />
                )}

                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    title="Cancel Tournament?"
                    message="This action cannot be undone. Are you sure you want to cancel this tournament?"
                    onConfirm={handleConfirmCancel}
                    onCancel={closeConfirmModal}
                />

                <PrizeInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                />
            </div>
        </>
    );
}