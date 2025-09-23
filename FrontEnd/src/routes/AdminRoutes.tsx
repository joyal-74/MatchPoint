import Dashboard from "../pages/admin/Dashboard";
import ManagersManagement from "../pages/admin/ManagersManagement";
import PlayersManagement from "../pages/admin/PlayersManagement";
import ViewersManagement from "../pages/admin/ViewersManagement";
import ProtectedRoute from "./ProtectedRoute";

export const adminRoutes = [
    { path: "/admin/dashboard", element: <ProtectedRoute redirectTo = "/admin/login" allowedRoles={['admin']}><Dashboard /></ProtectedRoute> },
    { path: "/admin/viewers", element: <ViewersManagement /> },
    { path: "/admin/players", element: <PlayersManagement /> },
    { path: "/admin/managers", element: <ManagersManagement /> },
];