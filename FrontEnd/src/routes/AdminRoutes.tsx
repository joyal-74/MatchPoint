import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";



const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManagersManagement = lazy(() => import("../pages/admin/ManagersManagement"));
const PlayersManagement = lazy(() => import("../pages/admin/PlayersManagement"));
const ViewersManagement = lazy(() => import("../pages/admin/ViewersManagement"));
const ManagerDetails = lazy(() => import("../pages/admin/ManagerDetails"));
const PlayerDetails = lazy(() => import("../pages/admin/PlayerDetails"));
const ViewerDetails = lazy(() => import("../pages/admin/ViewerDetails"));

const withAdminProtection = (component: JSX.Element) => (
    <ProtectedRoute redirectTo="/admin/login" allowedRoles={["admin"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

export const adminRoutes = [
    { path: "/admin/dashboard", element: withAdminProtection(<Dashboard />) },
    { path: "/admin/viewers", element: withAdminProtection(<ViewersManagement />) },
    { path: "/admin/players", element: withAdminProtection(<PlayersManagement />) },
    { path: "/admin/managers", element: withAdminProtection(<ManagersManagement />) },
    { path: "/admin/managers/:id/details", element: withAdminProtection(<ManagerDetails />) },
    { path: "/admin/players/:id/details", element: withAdminProtection(<PlayerDetails />) },
    { path: "/admin/viewers/:id/details", element: withAdminProtection(<ViewerDetails />) },
];