import Navbar from "../../components/manager/Navbar";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import CreateTournamentModal from "../../components/manager/tournaments/TournamentModal/CreateTournamentModal";
import EditTournamentModal from "../../components/manager/tournaments/TournamentModal/EditTournamentModal";
import ConfirmModal from "../../components/shared/modal/ConfirmModal";
import PrizeInfoModal from "../../components/manager/tournaments/TournamentModal/PriceInfoModal";
import TournamentsHeader from "../../components/manager/tournaments/TournamentsHeader";
import MyTournamentsSection from "../../components/manager/tournaments/MyTournamentsSection";
import ExploreTournamentsSection from "../../components/manager/tournaments/ExploreTournamentsSection";
import TournamentsStats from "../../components/manager/tournaments/TournamentsStats";
import { useTournaments,  } from "../../hooks/useTournaments";
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

            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-12 mx-10">
                <TournamentsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

                <MyTournamentsSection
                    tournaments={showMyTournaments}
                    hasMore={hasMoreMyTournaments}
                    onShowAll={handleShowAll}
                    onEdit={handleEditClick}
                    onCancel={handleCancelClick}
                    onCreate={() => setIsCreateModalOpen(true)}
                />

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

                <TournamentsStats
                    totalTournaments={exploreTournaments.length}
                    onLearnMore={() => setIsInfoModalOpen(true)}
                />

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