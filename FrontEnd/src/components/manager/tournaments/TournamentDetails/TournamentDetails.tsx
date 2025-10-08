import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import TournamentHeader from "./TournamentHeader";
import TournamentTabs from "./TournamentTabs";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import type { RootState } from "../../../../app/store";
import { fetchTournament, getRegisteredTeams } from "../../../../features/manager/Tournaments/tournamentThunks";
import LoadingOverlay from "../../../shared/LoadingOverlay";
import { renderTabContent, type TabType } from "./tabs/TabContent";
import RegisterTeamModal from "./RegisterTeamModal";
import { getAllTeams } from "../../../../features/manager";

export default function TournamentDetailsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<TabType>("info");
    const { selectedTournament, loading, registeredTeams } = useAppSelector((state: RootState) => state.managerTournaments);
    const { id, type } = useParams<{ id: string; type: "manage" | 'explore' }>();

    const [showModal, setShowModal] = useState(false);

    const { teams, fetched, loading: teamsLoading } = useAppSelector(state => state.manager);
    const { user } = useAppSelector(state => state.auth);

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
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-10 mx-12">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 transition-all duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-6 w-px bg-neutral-700/50" />
                    <h1 className="text-2xl font-bold">Tournament Details</h1>
                </div>

                <TournamentHeader
                    tournamentData={selectedTournament}
                    type={type!}
                    onClick={() => setShowModal(true)}
                />
                <TournamentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="animate-fade-in">{renderTabContent(selectedTournament, registeredTeams, activeTab)}</div>
            </div>

            <RegisterTeamModal
                show={showModal}
                onClose={() => setShowModal(false)}
                entryFee={Number(selectedTournament.entryFee)}
                tournament={selectedTournament}
                teams={teams}
                managerId={user._id}
            />
        </>
    );
}
