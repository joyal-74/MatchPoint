import { lazy, Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import MyStatisticsPage from "../pages/player/MyStats/MyStatisticsPage";

const PlayerDashboard = lazy(() => import("../pages/player/LandingPage"));
const ViewTeam = lazy(() => import("../pages/player/TeamDetailsPage"));
const TeamsListPage = lazy(() => import("../pages/player/TeamsListPage"));
const TournamentsPage = lazy(() => import("../pages/player/Tournaments"));
const PlayerProfilePage = lazy(() => import("../pages/player/ProfilePage"));
const TeamFinderPage = lazy(() => import("../pages/player/TeamsPage"));
const TeamChat = lazy(() => import("../pages/player/TeamChat/TeamChat"));

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
    { path: "/player/teams", element: withPlayerProtection(<TeamFinderPage />) },
    { path: "/player/myteams/:status", element: withPlayerProtection(<TeamsListPage />) },
    { path: "/player/myteam/:teamId", element: withPlayerProtection(<ViewTeam />) },
    { path: "/player/mystats", element: withPlayerProtection(<MyStatisticsPage />) },
    { path: "/player/chats", element: withPlayerProtection(<TeamChat />) },
];
