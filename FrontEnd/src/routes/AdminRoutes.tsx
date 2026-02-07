import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import AdminLoginPage from "../pages/auth/AdminLogin";
import PublicRoute from "./PublicRoute";

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

const AdminRoutes = () => {
    return (
        <Suspense fallback={<LoadingOverlay show />}>
            <Routes>
                <Route path="login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
                <Route path="dashboard" element={withAdminProtection(<Dashboard />)} />
                <Route path="viewers" element={withAdminProtection(<ViewersManagement />)} />
                <Route path="players" element={withAdminProtection(<PlayersManagement />)} />
                <Route path="managers" element={withAdminProtection(<ManagersManagement />)} />
                <Route path="teams" element={withAdminProtection(<TeamManagement />)} />
                <Route path="tournaments" element={withAdminProtection(<TournamentManagement />)} />
                <Route path="managers/:id/details" element={withAdminProtection(<ManagerDetails />)} />
                <Route path="players/:id/details" element={withAdminProtection(<PlayerDetails />)} />
                <Route path="viewers/:id/details" element={withAdminProtection(<ViewerDetails />)} />
                <Route path="teams/:id/details" element={withAdminProtection(<TeamDetailsPage />)} />
                <Route path="tournament/:id/details" element={withAdminProtection(<TournamentDetailsPage />)} />
                <Route path="subscriptions" element={withAdminProtection(<SubscriptionManagement />)} />
                <Route path="transactions" element={withAdminProtection(<TransactionManagement />)} />
                <Route path="transactions/:id" element={withAdminProtection(<TransactionDetailsPage />)} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;