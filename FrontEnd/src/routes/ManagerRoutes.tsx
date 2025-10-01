import Dashboard from "../pages/manager/Dashboard";
import TeamsListPage from "../pages/manager/TeamsListPage";
import TournamentsPage from "../pages/manager/TournamentsPage";
import ProtectedRoute from "./ProtectedRoute";

export const managerRoutes = [
    { path: "/manager/dashboard", element: <ProtectedRoute allowedRoles={['manager']}><Dashboard /></ProtectedRoute> },
    { path: "/manager/teams", element: <ProtectedRoute allowedRoles={['manager']}><TeamsListPage /></ProtectedRoute> },
    { path: "/manager/tournaments", element: <ProtectedRoute allowedRoles={['manager']}><TournamentsPage /></ProtectedRoute> },
];