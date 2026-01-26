import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/manager/Navbar";
import TournamentHeader from "../../components/manager/tournaments/TournamentDetails/TournamentHeader";
import TournamentTabs from "../../components/manager/tournaments/TournamentDetails/TournamentTabs";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../app/store";
import { fetchTournament, getRegisteredTeams } from "../../features/manager/Tournaments/tournamentThunks";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { renderTabContent, type TabType } from "../../components/manager/tournaments/TournamentDetails/tabs/TabContent";
import { getAllTeams } from "../../features/manager";
import RegisterTeamModal from "../../components/manager/tournaments/TournamentDetails/RegisterTeamModal/RegisterTeamModal";

export default function TournamentDetailsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<TabType>("info");
    
    const { selectedTournament, loading, registeredTeams } = useAppSelector((state: RootState) => state.managerTournaments);
    const { id, type } = useParams<{ id: string; type: "manage" | 'explore' }>();

    // --- STATE MANAGEMENT ---
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    // Removed showEditModal state

    const { teams, fetched, loading: teamsLoading } = useAppSelector(state => state.manager);
    const { user } = useAppSelector(state => state.auth);

    const isAlreadyRegistered = registeredTeams.some(reg =>
        teams.some(team => reg.teamId === team._id)
    );

    if (!user) throw new Error('User not found');

    // --- DATA FETCHING ---
    useEffect(() => {
        if (!fetched && !teamsLoading) {
            dispatch(getAllTeams(user._id));
        }
    }, [teams, dispatch, user, fetched, teamsLoading]);

    useEffect(() => {
        if (id) dispatch(fetchTournament(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (id) dispatch(getRegisteredTeams(id));
    }, [id, dispatch]);


    // --- ACTION HANDLER ---
    const handleHeaderAction = () => {
        if (type === 'manage' && id) {
            navigate(`/manager/tournaments/${id}/edit`);
        } else {
            setShowRegisterModal(true);
        }
    };

    if (loading || !selectedTournament) {
        return <LoadingOverlay show={true} />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex flex-col w-full px-4 md:px-10 max-w-[1920px] mx-auto">
                
                <div className="space-y-6">
                    <TournamentHeader
                        tournamentData={selectedTournament}
                        type={type!}
                        isRegistered={isAlreadyRegistered}
                        onClick={handleHeaderAction} 
                        onBack={() => navigate(-1)}
                    />

                    <TournamentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
                
                <div className="flex-1 w-full bg-background mt-4">
                    <div className="w-full py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderTabContent(selectedTournament, registeredTeams, activeTab, type!)}
                    </div>
                </div>
            </main>

            {/* --- MODAL 1: REGISTER (Explore Mode) --- */}
            <RegisterTeamModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                entryFee={Number(selectedTournament.entryFee)}
                tournament={selectedTournament}
                teams={teams}
                managerId={user._id}
            />
        </div>
    );
}