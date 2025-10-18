import PaymentFailedPage from "../components/manager/tournaments/TournamentDetails/paymentFailedPage";
import PaymentSuccessPage from "../components/manager/tournaments/TournamentDetails/PaymentSuccessPage";
import TournamentDetailsPage from "../components/manager/tournaments/TournamentDetails/TournamentDetails";
import Dashboard from "../pages/manager/Dashboard";
import TeamsListPage from "../pages/manager/TeamsListPage";
import TournamentsPage from "../pages/manager/TournamentsPage";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "../pages/manager/ProfilePage";
import ViewTeamManager from "../pages/manager/ViewTeamManager";
import ManageMembersPage from "../pages/manager/ManageMembers";


export const managerRoutes = [
    { path: "/manager/dashboard", element: <ProtectedRoute allowedRoles={['manager']}><Dashboard /></ProtectedRoute> },
    { path: "/manager/profile", element: <ProtectedRoute allowedRoles={['manager']}><UserProfile /></ProtectedRoute> },
    { path: "/manager/teams", element: <ProtectedRoute allowedRoles={['manager']}><TeamsListPage /></ProtectedRoute> },
    { path: "/manager/team/:teamId", element: <ProtectedRoute allowedRoles={['manager']}><ViewTeamManager /></ProtectedRoute> },
    { path: "/manager/team/:teamId/manage", element: <ProtectedRoute allowedRoles={['manager']}><ManageMembersPage /></ProtectedRoute> },
    { path: "/manager/tournaments", element: <ProtectedRoute allowedRoles={['manager']}><TournamentsPage /></ProtectedRoute> },
    { path: "/manager/tournaments/:id/:type", element: <ProtectedRoute allowedRoles={['manager']}><TournamentDetailsPage /></ProtectedRoute> },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-success", element: <ProtectedRoute allowedRoles={['manager']}><PaymentSuccessPage /></ProtectedRoute> },
    { path: "/manager/tournaments/:tournamentId/:teamId/payment-failed", element: <ProtectedRoute allowedRoles={['manager']}><PaymentFailedPage /></ProtectedRoute> },
];