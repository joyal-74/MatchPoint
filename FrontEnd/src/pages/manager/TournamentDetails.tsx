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

    const [showModal, setShowModal] = useState(false);

    const { teams, fetched, loading: teamsLoading } = useAppSelector(state => state.manager);
    const { user } = useAppSelector(state => state.auth);

    const isAlreadyRegistered = registeredTeams.some(reg =>
        teams.some(team => reg.teamId === team._id)
    );

    if (!user) throw new Error('User not found')

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


    if (loading || !selectedTournament) {
        return <LoadingOverlay show={true} />;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex flex-col w-full mt-15 px-10">
                
                <TournamentHeader
                    tournamentData={selectedTournament}
                    type={type!}
                    isRegistered={isAlreadyRegistered}
                    onClick={() => setShowModal(true)}
                    onBack={() => navigate(-1)}
                />

                <TournamentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                
                <div className="flex-1 w-full bg-neutral-950">
                    <div className="w-full px-4 md:px-8 py-6 animate-fade-in">
                        {renderTabContent(selectedTournament, registeredTeams, activeTab, type!)}
                    </div>
                </div>
            </main>

            <RegisterTeamModal
                show={showModal}
                onClose={() => setShowModal(false)}
                entryFee={Number(selectedTournament.entryFee)}
                tournament={selectedTournament}
                teams={teams}
                managerId={user._id}
            />
        </div>
    );
}