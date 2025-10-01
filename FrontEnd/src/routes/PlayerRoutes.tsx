import PlayerDashboard from "../pages/player/LandingPage";
import ProtectedRoute from "./ProtectedRoute";

export const playerRoutes = [
    { path: "/player/dashboard", element: <ProtectedRoute allowedRoles={['player']}><PlayerDashboard /></ProtectedRoute> },
];