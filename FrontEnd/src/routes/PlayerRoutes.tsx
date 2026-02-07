import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import RoleLayoutWrapper from "../pages/shared/RoleLayoutWrapper";

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
const SettingsPage = lazy(() => import("../pages/shared/SettingsPage"));
const SubscriptionPage = lazy(() => import("../pages/shared/SubscriptionsPage"));
const NotificationsPage = lazy(() => import("../pages/player/NotificationsPage"));

const withPlayerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["player"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

const PlayerRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={withPlayerProtection(<PlayerDashboard />)} />
            <Route path="profile" element={withPlayerProtection(<PlayerProfilePage />)} />
            <Route path="tournaments" element={withPlayerProtection(<TournamentsPage />)} />
            <Route path="mytournaments" element={withPlayerProtection(<MyTournamentsPage />)} />
            <Route path="live" element={withPlayerProtection(<LiveMatchesPage />)} />
            <Route path="live/:matchId/details" element={withPlayerProtection(<LiveMatchDetails />)} />
            <Route path="tournaments/:id" element={withPlayerProtection(<TournamentDetailsPage />)} />
            <Route path="teams" element={withPlayerProtection(<TeamFinderPage />)} />
            <Route path="myteams/:status" element={withPlayerProtection(<TeamsListPage />)} />
            <Route path="myteam/:teamId" element={withPlayerProtection(<ViewTeam />)} />
            <Route path="statistics" element={withPlayerProtection(<MyStatisticsPage />)} />
            <Route path="chat" element={withPlayerProtection(<TeamChat />)} />
            <Route path="settings" element={<RoleLayoutWrapper><SettingsPage /></RoleLayoutWrapper>} />
            <Route path="subscription" element={<RoleLayoutWrapper><SubscriptionPage /></RoleLayoutWrapper>} />
            <Route path="notifications" element={<RoleLayoutWrapper><NotificationsPage /></RoleLayoutWrapper>} />
        </Routes>
    );
};

export default PlayerRoutes;