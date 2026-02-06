import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";

const UmpireLandingPage = lazy(() => import("../pages/umpire/UmpireLandingPage"));
const MatchCenter = lazy(() => import("../pages/umpire/MatchCenter"));
const MatchDetails = lazy(() => import("../pages/umpire/MatchDetails"));
const ScoreboardDashboard = lazy(() => import("../pages/umpire/scoreControl/ScoreboardDashboard"));
const ProfilePage = lazy(() => import("../pages/umpire/ProfilePage"));

const withUmpireProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["umpire"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

const UmpireRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={withUmpireProtection(<UmpireLandingPage />)} />
            <Route path="profile" element={withUmpireProtection(<ProfilePage />)} />
            <Route path="matches" element={withUmpireProtection(<MatchCenter />)} />
            <Route path="matches/details" element={withUmpireProtection(<MatchDetails />)} />
            <Route path="matches/:matchId/live-score" element={withUmpireProtection(<ScoreboardDashboard />)} />
        </Routes>
    );
};

export default UmpireRoutes;