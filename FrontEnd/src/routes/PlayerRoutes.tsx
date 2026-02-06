import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";

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
            <Route path="statistics" element={withPlayerProtection(<MyStatisticsPage />) } />
            <Route path="chat" element={withPlayerProtection(<TeamChat />)} />
        </Routes>
    );
};

export default PlayerRoutes;