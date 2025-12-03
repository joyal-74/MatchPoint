import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import MatchControlPage from "../components/manager/matches/ScoreControlPanel/MatchControlPage";
import MatchDashboard from "../components/manager/matches/MatchDashboard";

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
    { path: "/manager/team/:teamId", element: withManagerProtection(<ViewTeamManager />) },
    { path: "/manager/team/:teamId/manage", element: withManagerProtection(<ManageMembersPage />) },
    { path: "/manager/tournaments", element: withManagerProtection(<TournamentsPage />) },
    { path: "/manager/tournaments/:id/:type", element: withManagerProtection(<TournamentDetailsPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-success", element: withManagerProtection(<PaymentSuccessPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-failed", element: withManagerProtection(<PaymentFailedPage />) },
    { path: "/manager/match/:matchId/dashboard", element: withManagerProtection(<MatchDashboard />) },
    { path: "/manager/tournaments/match/control", element: withManagerProtection(<MatchControlPage />) },
];