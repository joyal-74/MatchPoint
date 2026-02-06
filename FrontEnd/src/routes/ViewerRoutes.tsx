import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";

const Home = lazy(() => import("../pages/viewer/Home"));
const LiveMatchPage = lazy(() => import("../pages/viewer/match/LiveMatchPage"));
const LiveMatches = lazy(() => import("../pages/viewer/LiveMatches"));
const ProfilePage = lazy(() => import("../pages/viewer/ProfilePage"));
const LiveStreamViewer = lazy(() => import("../pages/viewer/LiveStreamViewer"));
const WalletPage = lazy(() => import("../pages/viewer/WalletPage"));
const TournamentsPage = lazy(() => import("../pages/viewer/Tournaments"));

const withViewerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["viewer", "admin", "player", "manager"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

const ViewerRoutes = () => {
    return (
        <Routes>
            <Route index element={withViewerProtection(<Home />)} />
            <Route path="profile" element={withViewerProtection(<ProfilePage />)} />
            <Route path="tournaments" element={withViewerProtection(<TournamentsPage />)} />
            <Route path="live" element={withViewerProtection(<LiveMatches />)} />
            <Route path="live/:matchId/details" element={withViewerProtection(<LiveMatchPage />)} />
            <Route path="live/:matchId/details/stream" element={withViewerProtection(<LiveStreamViewer />)} />
            <Route path="wallet" element={withViewerProtection(<WalletPage />)} />
        </Routes>
    );
};

export default ViewerRoutes;