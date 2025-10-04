import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import TournamentHeader from "./TournamentHeader";
import TournamentTabs from "./TournamentTabs";
import { InfoTab, TeamsTab, FixturesTab, MatchesTab, ResultsTab, GroupsTab, LeaderboardTab } from "./tabs";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "../../../../hooks/hooks";
import type { RootState } from "../../../../app/store";

export type TabType = "info" | "teams" | "fixtures" | "matches" | "results" | "groups" | "leaderboard";

export default function TournamentDetailsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("info");
    const selectedTournament = useAppSelector(
        (state: RootState) => state.managerTournaments.selectedTournament
    );

    // Sample tournament data
    if (!selectedTournament) return <p className="text-white">No tournament selected.</p>;
    const tournamentData = selectedTournament;

    const registeredTeams = [
        {
            name: "Kochi Kings",
            captain: "Rahul Sharma",
            registeredOn: "05 Jan 2025",
        },
        {
            name: "Trivandrum Titans",
            captain: "Vikram Nair",
            registeredOn: "06 Jan 2025",
        },
        {
            name: "Kozhikode Warriors",
            captain: "Arjun Menon",
            registeredOn: "07 Jan 2025",
        },
        {
            name: "Thrissur Lions",
            captain: "Suresh Kumar",
            registeredOn: "08 Jan 2025",
        },
    ];

    // Tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "info":
                return <InfoTab tournamentData={tournamentData} registeredTeams={registeredTeams} />;
            case "teams":
                return <TeamsTab registeredTeams={registeredTeams} />;
            case "fixtures":
                return <FixturesTab />;
            case "matches":
                return <MatchesTab />;
            case "results":
                return <ResultsTab />;
            case "groups":
                return <GroupsTab />;
            case "leaderboard":
                return <LeaderboardTab />;
            default:
                return <InfoTab tournamentData={tournamentData} registeredTeams={registeredTeams} />;
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-10 mx-12">
                {/* Header */}
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

                <TournamentHeader tournamentData={tournamentData} />

                {/* Tabs */}
                <TournamentTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <div className="animate-fade-in">{renderTabContent()}</div>
            </div>
        </>
    );
}