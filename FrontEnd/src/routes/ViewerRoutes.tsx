import ProfilePage from "../components/viewer/profile/ProfileSection";
import ProtectedRoute from "./ProtectedRoute";

export const viewerRoutes = [
    { path: "/profile", element: <ProtectedRoute allowedRoles={['viewer']}><ProfilePage /></ProtectedRoute> },
];