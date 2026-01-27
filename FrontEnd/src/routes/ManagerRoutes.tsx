import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import MatchDashboard from "../components/manager/matches/MatchDashboard";
import ScoreboardDashboard from "../components/manager/scoreControl/ScoreboardDashboard";
import EarningsPage from "../components/manager/EarningsOverview";
import FinancialsPage from "../components/manager/PaymentsPage";
import ExplorePage from "../pages/manager/ExplorePage";
import MatchesSection from "../pages/manager/MatchesPage";
import MyMatchesPage from "../pages/manager/MyMatches";
import CreateTournamentPage from "../components/manager/tournaments/TournamentModal/CreateTournamentPage";
import EditTournamentPage from "../components/manager/tournaments/TournamentModal/EditTournamentPage";
import StreamSettings from "../components/manager/liveStream/StreamSettings";

// Lazy load manager pages
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
    { path: "/manager/payments", element: withManagerProtection(<FinancialsPage />) },
    { path: "/manager/payments/earnings", element: withManagerProtection(<EarningsPage />) },
    { path: "/manager/team/:teamId", element: withManagerProtection(<ViewTeamManager />) },
    { path: "/manager/team/:teamId/manage", element: withManagerProtection(<ManageMembersPage />) },
    { path: "/manager/tournaments", element: withManagerProtection(<TournamentsPage />) },
    { path: "/manager/tournaments/create", element: withManagerProtection(<CreateTournamentPage />) },
    { path: "/manager/tournaments/:id/edit", element: withManagerProtection(<EditTournamentPage />) },
    { path: "/manager/explore", element: withManagerProtection(<ExplorePage />) },
    { path: "/manager/tournaments/match/details", element: withManagerProtection(<MatchDetailsPage />) },
    { path: "/manager/tournaments/:id/:type", element: withManagerProtection(<TournamentDetailsPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-success", element: withManagerProtection(<PaymentSuccessPage />) },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-failed", element: withManagerProtection(<PaymentFailedPage />) },
    { path: "/manager/match/:matchId/dashboard", element: withManagerProtection(<MatchDashboard />) },
    { path: "/manager/matches", element: withManagerProtection(<MatchesSection />) },
    { path: "/manager/mymatches", element: withManagerProtection(<MyMatchesPage />) },
    { path: "/manager/match/:matchId/stream", element: withManagerProtection(<StreamSettings />) },
    { path: "/manager/match/:matchId/control", element: withManagerProtection(<ScoreboardDashboard />) },
];