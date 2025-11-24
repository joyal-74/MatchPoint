import Home from "../pages/viewer/Home";
import ProfilePage from "../pages/viewer/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export const viewerRoutes = [
    { path: "/profile", element: <ProtectedRoute allowedRoles={['viewer']}><ProfilePage /></ProtectedRoute> },
    { path: "/", element: <ProtectedRoute allowedRoles={['viewer', 'admin', 'player', 'manager']}><Home /></ProtectedRoute> },
];