import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import MatchDashboard from "../components/manager/matches/MatchDashboard";
import ScoreboardDashboard from "../components/manager/scoreControl/ScoreboardDashboard";
import SettingsPage from "../components/shared/SettingsPage";
import EarningsPage from "../components/manager/EarningsOverview";
import FinancialsPage from "../components/manager/PaymentsPage";

// Lazy load manager pages
const Dashboard = lazy(() => import("../pages/manager/Dashboard"));
const UserProfile = lazy(() => import("../pages/manager/ProfilePage"));
const TeamsListPage = lazy(() => import("../pages/manager/TeamsListPage"));
const ViewTeamManager = lazy(() => import("../pages/manager/ViewTeamManager"));
const ManageMembersPage = lazy(() => import("../pages/manager/ManageMembers"));
const TournamentsPage = lazy(() => import("../pages/manager/TournamentsPage"));
const TournamentDetailsPage = lazy(() => import("../pages/manager/TournamentDetails"));
const PaymentSuccessPage = lazy(() => import("../components/manager/tournaments/TournamentDetails/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("../components/manager/tournaments/TournamentDetails/PaymentFailedPage"));

const withManagerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["manager"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

export const managerRoutes = [
    { path: "/manager/dashboard", element: withManagerProtection(<Dashboard />) },
    { path: "/manager/profile", element: withManagerProtection(<UserProfile />) },
    { path: "/manager/teams", element: withManagerProtection(<TeamsListPage />) },
    { path: "/manager/settings", element: withManagerProtection(<SettingsPage />) },
    { path: "/manager/payments", element: withManagerProtection(<FinancialsPage />) },
    { path: "/manager/payments/earnings", element: withManagerProtection(<EarningsPage />) },
    { path: "/manager/team/:teamId", element: withManagerProtection(<ViewTeamManager />) },
    { path: "/manager/team/:teamId/manage", element: withManagerProtection(<ManageMembersPage />) },
    { path: "/manager/tournaments", element: withManagerProtection(<TournamentsPage />) },
    { path: "/manager/tournaments/:id/:type", element: withManagerProtection(<TournamentDetailsPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-success", element: withManagerProtection(<PaymentSuccessPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-failed", element: withManagerProtection(<PaymentFailedPage />) },
    { path: "/manager/match/:matchId/dashboard", element: withManagerProtection(<MatchDashboard />) },
    { path: "/manager/match/:matchId/control", element: withManagerProtection(<ScoreboardDashboard />) },
];