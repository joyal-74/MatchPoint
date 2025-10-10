import PlayerDashboard from "../pages/player/LandingPage";
import ViewTeam from "../pages/player/TeamDetailsPage";
import TeamsListPage from "../pages/player/TeamsListPage";
import TournamentsPage from "../pages/player/Tournaments";
import ProtectedRoute from "./ProtectedRoute";
import PlayerProfilePage from "../components/player/profile/ProfileSection";
import TeamFinderPage from "../pages/player/TeamsPage";

export const playerRoutes = [
    { path: "/player/dashboard", element: <ProtectedRoute allowedRoles={['player']}><PlayerDashboard /></ProtectedRoute> },
    { path: "/player/profile", element: <ProtectedRoute allowedRoles={['player']}><PlayerProfilePage /></ProtectedRoute> },
    { path: "/player/tournaments", element: <ProtectedRoute allowedRoles={['player']}><TournamentsPage /></ProtectedRoute> },
    { path: "/player/teams", element: <ProtectedRoute allowedRoles={['player']}><TeamFinderPage /></ProtectedRoute> },
    { path: "/player/myteams", element: <ProtectedRoute allowedRoles={['player']}><TeamsListPage /></ProtectedRoute> },
    { path: "/player/myteams/:teamId", element: <ProtectedRoute allowedRoles={['player']}><ViewTeam /></ProtectedRoute> },
];