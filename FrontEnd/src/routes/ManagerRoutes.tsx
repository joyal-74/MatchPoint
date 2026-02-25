import { lazy, Suspense, type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import RoleLayoutWrapper from "../pages/shared/RoleLayoutWrapper";

// Helper for protection
const withManagerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["manager"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

// Lazy loaded manager pages
const Dashboard = lazy(() => import("../pages/manager/Dashboard"));
const UserProfile = lazy(() => import("../pages/manager/ProfilePage"));
const TeamsListPage = lazy(() => import("../pages/manager/TeamsListPage"));
const ViewTeamManager = lazy(() => import("../pages/manager/ViewTeamManager"));
const ManageMembersPage = lazy(() => import("../pages/manager/ManageMembers"));
const TournamentsPage = lazy(() => import("../pages/manager/TournamentsPage"));
const MatchDetailsPage = lazy(() => import("../components/manager/tournaments/MatchDetailsPage"));
const TournamentDetailsPage = lazy(() => import("../pages/manager/TournamentDetails"));
const PaymentSuccessPage = lazy(() => import("../components/manager/tournaments/TournamentDetails/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("../components/manager/tournaments/TournamentDetails/paymentFailedPage"));
const MatchDashboard = lazy(() => import("../components/manager/matches/MatchDashboard"));
const ScoreboardDashboard = lazy(() => import("../components/manager/scoreControl/ScoreboardDashboard"));
const EarningsPage = lazy(() => import("../components/manager/EarningsOverview"));
const WalletPage = lazy(() => import("../components/manager/PaymentsPage"));
const FinancialHistory = lazy(() => import("../components/manager/wallet/FinancialHistory"));
const ExplorePage = lazy(() => import("../pages/manager/ExplorePage"));
const MatchesSection = lazy(() => import("../pages/manager/MatchesPage"));
const MyMatchesPage = lazy(() => import("../pages/manager/MyMatches"));
const CreateTournamentPage = lazy(() => import("../components/manager/tournaments/TournamentModal/CreateTournamentPage"));
const EditTournamentPage = lazy(() => import("../components/manager/tournaments/TournamentModal/EditTournamentPage"));
const StreamSettings = lazy(() => import("../components/manager/liveStream/StreamSettings"));
const SettingsPage = lazy(() => import("../pages/shared/SettingsPage"));
const SubscriptionPage = lazy(() => import("../pages/shared/SubscriptionsPage"));
const NotificationsPage = lazy(() => import("../pages/shared/NotificationsPage"));

const ManagerRoutes = () => {
    return (
        <Routes>
            {/* Paths are relative to /manager/ */}
            <Route path="dashboard" element={withManagerProtection(<Dashboard />)} />
            <Route path="profile" element={withManagerProtection(<UserProfile />)} />
            <Route path="teams" element={withManagerProtection(<TeamsListPage />)} />
            <Route path="payments" element={withManagerProtection(<WalletPage />)} />
            <Route path="payments/history" element={withManagerProtection(<FinancialHistory />)} />
            <Route path="payments/earnings" element={withManagerProtection(<EarningsPage />)} />
            <Route path="team/:teamId" element={withManagerProtection(<ViewTeamManager />)} />
            <Route path="team/:teamId/manage" element={withManagerProtection(<ManageMembersPage />)} />
            <Route path="tournaments" element={withManagerProtection(<TournamentsPage />)} />
            <Route path="tournaments/create" element={withManagerProtection(<CreateTournamentPage />)} />
            <Route path="tournaments/:id/edit" element={withManagerProtection(<EditTournamentPage />)} />
            <Route path="explore" element={withManagerProtection(<ExplorePage />)} />
            <Route path="tournaments/match/details" element={withManagerProtection(<MatchDetailsPage />)} />
            <Route path="tournaments/:id/:type" element={withManagerProtection(<TournamentDetailsPage />)} />
            <Route path="tournaments/:tournamentId/:teamId/payment-success" element={withManagerProtection(<PaymentSuccessPage />)} />
            <Route path="tournaments/:tournamentId/:teamId/payment-failed" element={withManagerProtection(<PaymentFailedPage />)} />
            <Route path="match/:matchId/dashboard" element={withManagerProtection(<MatchDashboard />)} />
            <Route path="matches" element={withManagerProtection(<MatchesSection />)} />
            <Route path="mymatches" element={withManagerProtection(<MyMatchesPage />)} />
            <Route path="match/:matchId/stream" element={withManagerProtection(<StreamSettings />)} />
            <Route path="match/:matchId/control" element={withManagerProtection(<ScoreboardDashboard />)} />
            <Route path="settings" element={withManagerProtection(<RoleLayoutWrapper><SettingsPage /></RoleLayoutWrapper>)} />
            <Route path="subscription" element={withManagerProtection(<RoleLayoutWrapper><SubscriptionPage /></RoleLayoutWrapper>)} />
            <Route path="notifications" element={withManagerProtection(<RoleLayoutWrapper><NotificationsPage /></RoleLayoutWrapper>)} />

            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default ManagerRoutes;