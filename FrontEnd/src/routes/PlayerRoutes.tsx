import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";

const LoadingOverlay = lazy(() => import("../components/shared/LoadingOverlay"));
const MyStatisticsPage = lazy(() => import("../pages/player/MyStats/MyStatisticsPage"));
const MyTournamentsPage = lazy(() => import("../pages/player/MyTournamentsPage"));
const TournamentDetailsPage = lazy(() => import("../components/player/TournamentDetailsPage"));
const PlayerDashboard = lazy(() => import("../pages/player/LandingPage"));
const ViewTeam = lazy(() => import("../pages/player/TeamDetailsPage"));
const TeamsListPage = lazy(() => import("../pages/player/TeamsListPage"));
const TournamentsPage = lazy(() => import("../pages/player/Tournaments"));
const PlayerProfilePage = lazy(() => import("../pages/player/ProfilePage"));
const TeamFinderPage = lazy(() => import("../pages/player/TeamsPage"));
const TeamChat = lazy(() => import("../pages/player/TeamChat/TeamChat"));
const LiveMatchDetails = lazy(() => import("../pages/player/LiveMatchDetails"));
const LiveMatchesPage = lazy(() => import("../pages/player/LiveMatchPage"));

const withPlayerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["player"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

export const playerRoutes = [
    { path: "/player/dashboard", element: withPlayerProtection(<PlayerDashboard />) },
    { path: "/player/profile", element: withPlayerProtection(<PlayerProfilePage />) },
    { path: "/player/tournaments", element: withPlayerProtection(<TournamentsPage />) },
    { path: "/player/mytournaments", element: withPlayerProtection(<MyTournamentsPage />) },
    { path: "/player/live", element: withPlayerProtection(<LiveMatchesPage />) },
    { path: "/player/live/:matchId/details", element: withPlayerProtection(<LiveMatchDetails />) },
    { path: "/player/tournaments/:id", element: withPlayerProtection(<TournamentDetailsPage />) },
    { path: "/player/teams", element: withPlayerProtection(<TeamFinderPage />) },
    { path: "/player/myteams/:status", element: withPlayerProtection(<TeamsListPage />) },
    { path: "/player/myteam/:teamId", element: withPlayerProtection(<ViewTeam />) },
    { path: "/player/statistics", element: withPlayerProtection(<MyStatisticsPage />) },
    { path: "/player/chat", element: withPlayerProtection(<TeamChat />) },
];