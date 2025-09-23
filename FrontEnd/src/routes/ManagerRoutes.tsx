import Dashboard from "../pages/manager/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const managerRoutes = [
    { path: "/manager/dashboard", element: <ProtectedRoute allowedRoles={['player']}><Dashboard /></ProtectedRoute> },
];