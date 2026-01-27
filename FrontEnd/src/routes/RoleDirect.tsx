import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { UserRole } from "../types/UserRoles";
import LoginPage from "../pages/auth/LoginPage";

const RoleRedirect = () => {
    const { user } = useAppSelector((state) => state.auth);

    if (!user) return <LoginPage />;

    switch (user.role) {
        case UserRole.Viewer:
            return <Navigate to="/" replace />;
        case UserRole.Admin:
            return <Navigate to="/admin/dashboard" replace />;
        case UserRole.Manager:
            return <Navigate to="/manager/dashboard" replace />;
        case UserRole.Player:
            return <Navigate to="/player/dashboard" replace />;
        case UserRole.Umpire:
            return <Navigate to="/umpire/dashboard" replace />;
        default:
            return <LoginPage />;
    }
};

export default RoleRedirect;