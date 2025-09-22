import Dashboard from "../pages/admin/Dashboard";
import PlayersManagement from "../pages/admin/PlayersManagement";
import ViewersManagement from "../pages/admin/ViewersManagement";

export const adminRoutes = [
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/admin/viewers", element: <ViewersManagement /> },
    { path: "/admin/players", element: <PlayersManagement /> },
];
