import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";


const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManagersManagement = lazy(() => import("../pages/admin/Manager/ManagersManagement"));
const PlayersManagement = lazy(() => import("../pages/admin/Player/PlayersManagement"));
const ViewersManagement = lazy(() => import("../pages/admin/Viewer/ViewersManagement"));
const TournamentManagement = lazy(() => import("../pages/admin/Tournament/TournamentManagement"));
const TeamManagement = lazy(() => import("../pages/admin/Team/TeamManagement"));
const SubscriptionManagement = lazy(() => import("../pages/admin/shared/SubscriptionManagement"));
const ManagerDetails = lazy(() => import("../pages/admin/Manager/ManagerDetails"));
const PlayerDetails = lazy(() => import("../pages/admin/Player/PlayerDetails"));
const ViewerDetails = lazy(() => import("../pages/admin/Viewer/ViewerDetails"));
const TeamDetailsPage = lazy(() => import("../pages/admin/Team/TeamDetailsPage"));
const TournamentDetailsPage = lazy(() => import("../pages/admin/Tournament/TournamentDetailsPage"));
const TransactionManagement = lazy(() => import("../pages/admin/Transactions/TransactionManagement"));
const TransactionDetailsPage = lazy(() => import("../pages/admin/Transactions/TransactionDetailsPage"));

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
    { path: "/admin/teams", element: withAdminProtection(<TeamManagement />) },
    { path: "/admin/tournaments", element: withAdminProtection(<TournamentManagement />) },
    { path: "/admin/managers/:id/details", element: withAdminProtection(<ManagerDetails />) },
    { path: "/admin/players/:id/details", element: withAdminProtection(<PlayerDetails />) },
    { path: "/admin/viewers/:id/details", element: withAdminProtection(<ViewerDetails />) },
    { path: "/admin/teams/:id/details", element: withAdminProtection(<TeamDetailsPage />) },
    { path: "/admin/tournament/:id/details", element: withAdminProtection(<TournamentDetailsPage />) },
    { path: "/admin/subscriptions", element: withAdminProtection(<SubscriptionManagement />) },
    { path: "/admin/transactions", element: withAdminProtection(<TransactionManagement />) },
    { path: "/admin/transactions/:id", element: withAdminProtection(<TransactionDetailsPage />) },
];