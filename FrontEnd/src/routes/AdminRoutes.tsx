import type { JSX } from "react";
import Dashboard from "../pages/admin/Dashboard";
import ManagersManagement from "../pages/admin/ManagersManagement";
import PlayersManagement from "../pages/admin/PlayersManagement";
import ViewersManagement from "../pages/admin/ViewersManagement";
import ProtectedRoute from "./ProtectedRoute";

const withAdminProtection = (component: JSX.Element) => (
    <ProtectedRoute redirectTo="/admin/login" allowedRoles={['admin']}>
        {component}
    </ProtectedRoute>
);

export const adminRoutes = [
    { path: "/admin/dashboard", element: withAdminProtection(<Dashboard />) },
    { path: "/admin/viewers", element: withAdminProtection(<ViewersManagement />) },
    { path: "/admin/players", element: withAdminProtection(<PlayersManagement />) },
    { path: "/admin/managers", element: withAdminProtection(<ManagersManagement />) },
];
