import { lazy, Suspense, type JSX } from "react";
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

export const viewerRoutes = [
    { path: "/", element: withViewerProtection(<Home />) },
    { path: "/profile", element: withViewerProtection(<ProfilePage />) },
    { path: "/tournaments", element: withViewerProtection(<TournamentsPage />) },
    { path: "/live", element: withViewerProtection(<LiveMatches />) },
    { path: "/live/:matchId/details", element: withViewerProtection(<LiveMatchPage />) },
    { path: "/live/:matchId/details/stream", element: withViewerProtection(<LiveStreamViewer />) },
    { path: "/wallet", element: withViewerProtection(<WalletPage />) },
];
