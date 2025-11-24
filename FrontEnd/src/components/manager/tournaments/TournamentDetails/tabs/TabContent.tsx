import type { Tournament } from "../../../../../features/manager/managerTypes";
import FixturesTab from "./Fixtures/FixturesTab";
import GroupsTab from "./GroupsTab";
import InfoTab from "./InfoTab";
import LeaderboardTab from "./LeaderboardTab";
import MatchesTab from "./MatchesTab";
import ResultsTab from "./ResultsTab";
import TeamsTab from "./TeamsTab";

export type TabType = "info" | "teams" | "fixtures" | "matches" | "results" | "groups" | "leaderboard";

export interface RegisteredTeam {
    _id: string;
    teamId: string;
    logo : string;
    name: string;
    captain: string;
    createdAt: string;
}

export const renderTabContent = (selectedTournament: Tournament, registeredTeams: RegisteredTeam[], activeTab: TabType, type : 'manage' | 'explore') => {
    switch (activeTab) {
        case "info":
            return <InfoTab tournamentData={selectedTournament} registeredTeams={registeredTeams} />;
        case "teams":
            return <TeamsTab registeredTeams={registeredTeams} />;
        case "fixtures":
            return <FixturesTab type={type} />;
        case "matches":
            return <MatchesTab />;
        case "results":
            return <ResultsTab />;
        case "groups":
            return <GroupsTab />;
        case "leaderboard":
            return <LeaderboardTab />;
        default:
            return <InfoTab tournamentData={selectedTournament} registeredTeams={registeredTeams} />;
    }
};
