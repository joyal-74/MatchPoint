import Home from "../pages/viewer/Home";
import LiveMatchPage from "../pages/viewer/match/LiveMatchPage";
import LiveMatches from "../pages/viewer/LiveMatches";
import ProfilePage from "../pages/viewer/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export const viewerRoutes = [
    { path: "/profile", element: <ProtectedRoute allowedRoles={['viewer']}><ProfilePage /></ProtectedRoute> },
    { path: "/", element: <ProtectedRoute allowedRoles={['viewer', 'admin', 'player', 'manager']}><Home /></ProtectedRoute> },
    { path: "/live", element: <ProtectedRoute allowedRoles={['viewer', 'admin', 'player', 'manager']}><LiveMatches /></ProtectedRoute> },
    { path: "/live/:matchId/details", element: <ProtectedRoute allowedRoles={['viewer', 'admin', 'player', 'manager']}><LiveMatchPage /></ProtectedRoute> },
];