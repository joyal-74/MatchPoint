import ProfilePage from "../pages/viewer/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export const viewerRoutes = [
    { path: "/profile", element: <ProtectedRoute allowedRoles={['viewer']}><ProfilePage /></ProtectedRoute> },
];