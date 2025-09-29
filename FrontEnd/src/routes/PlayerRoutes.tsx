import Dashboard from "../pages/player/Profile";
import ProtectedRoute from "./ProtectedRoute";

export const playerRoutes = [
    { path: "/player/dashboard", element: <ProtectedRoute allowedRoles={['player']}><Dashboard /></ProtectedRoute> },
];