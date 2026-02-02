import Navbar from "../../components/manager/Navbar";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import CreateTournamentModal from "../../components/manager/tournaments/TournamentModal/CreateTournamentModal";
import EditTournamentModal from "../../components/manager/tournaments/TournamentModal/EditTournamentModal";
import ConfirmModal from "../../components/shared/modal/ConfirmModal";
import PrizeInfoModal from "../../components/manager/tournaments/TournamentModal/PriceInfoModal";
import TournamentsHeader from "../../components/manager/tournaments/TournamentsHeader";
import MyTournamentsSection from "../../components/manager/tournaments/MyTournamentsSection";
import DashboardStats from "../../components/manager/tournaments/DashboardStats";
import DashboardAnalytics from "../../components/manager/tournaments/DashboardAnalytics";
import { useTournaments } from "../../hooks/useTournaments";
import { useAppDispatch } from "../../hooks/hooks";
import { cancelTournament } from "../../features/manager/Tournaments/tournamentThunks";
import { useTournamentModals } from "../../hooks/useTournamentModals";
import { useNavigate } from "react-router-dom";

export default function TournamentsPage() {
    const dispatch = useAppDispatch();

    const {
        showMyTournaments,
        loading,
        hasMoreMyTournaments,
        analyticsData,
        managerId,
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
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <LoadingOverlay show={loading} />
            <Navbar />

            <main className="flex-1 w-full px-4 md:px-10 mx-auto pt-4 pb-10">

                {/* === SECTION 1: HEADER === */}
                <TournamentsHeader onCreateClick={() => navigate(`/manager/tournaments/create`)} />

                {/* === SECTION 2: ANALYTICS DASHBOARD === */}
                <div className="mt-8 space-y-6">
                    {/* Key Metrics */}
                    <DashboardStats
                        myTournamentsCount={showMyTournaments.length}
                        totalExploreCount={0} // Irrelevant here, or pass a placeholder
                    />

                    {/* Detailed Charts */}
                    {analyticsData ? (
                        <DashboardAnalytics
                            revenueData={analyticsData.revenueData}
                            formatData={analyticsData.formatData}
                            trafficData={analyticsData.trafficData}
                            topTournaments={analyticsData.topTournaments}
                        />
                    ) : (
                        // Subtle Skeleton for Analytics
                        <div className="h-[300px] w-full bg-muted/20 rounded-xl animate-pulse flex items-center justify-center text-muted-foreground/50 text-sm">
                            Loading Dashboard Insights...
                        </div>
                    )}
                </div>

                {/* === SECTION 3: MY TOURNAMENTS === */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Your Tournaments</h2>
                        {/* Optional: Add a small filter for 'Active' vs 'Archived' here later if needed */}
                    </div>

                    <MyTournamentsSection
                        tournaments={showMyTournaments}
                        hasMore={hasMoreMyTournaments}
                        onShowAll={handleShowAll}
                        onEdit={handleEditClick}
                        onCancel={handleCancelClick}
                        onCreate={() => navigate(`/manager/tournaments/create`)}
                    />
                </div>

            </main>

            {/* === MODALS === */}
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
    );
}