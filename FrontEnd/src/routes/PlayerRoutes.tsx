import Dashboard from "../pages/player/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const playerRoutes = [
    { path: "/player/dashboard", element: <ProtectedRoute allowedRoles={['player']}><Dashboard /></ProtectedRoute> },
];