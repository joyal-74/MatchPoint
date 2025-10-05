import PlayerDashboard from "../pages/player/LandingPage";
import TeamFinder from "../pages/player/TeamsPage";
import TournamentsPage from "../pages/player/Tournaments";
import ProtectedRoute from "./ProtectedRoute";

export const playerRoutes = [
    { path: "/player/dashboard", element: <ProtectedRoute allowedRoles={['player']}><PlayerDashboard /></ProtectedRoute> },
    { path: "/player/tournaments", element: <ProtectedRoute allowedRoles={['player']}><TournamentsPage /></ProtectedRoute> },
    { path: "/player/teams", element: <ProtectedRoute allowedRoles={['player']}><TeamFinder /></ProtectedRoute> },
];