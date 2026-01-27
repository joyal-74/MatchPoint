import { Suspense, type JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import UmpireLandingPage from "../pages/umpire/UmpireLandingPage";
import MatchCenter from "../pages/umpire/MatchCenter";
import MatchDetails from "../pages/umpire/MatchDetails";
import ScoreboardDashboard from "../pages/umpire/scoreControl/ScoreboardDashboard";
import ProfilePage from "../pages/umpire/ProfilePage";

const withUmpireProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["umpire"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

export const umpireRoutes = [
    { path: "/umpire/dashboard", element: withUmpireProtection(<UmpireLandingPage />) },
    { path: "/umpire/profile", element: withUmpireProtection(<ProfilePage />) },
    { path: "/umpire/matches", element: withUmpireProtection(<MatchCenter />) },
    { path: "/umpire/matches/details", element: withUmpireProtection(<MatchDetails />) },
    { path: "/umpire/matches/:matchId/live-score", element: withUmpireProtection(<ScoreboardDashboard />) },
];