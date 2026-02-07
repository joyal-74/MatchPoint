import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { UserRole } from "../types/UserRoles";

const RoleRedirect = () => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case UserRole.Admin:
            return <Navigate to="/admin/dashboard" replace />;
        case UserRole.Manager:
            return <Navigate to="/manager/dashboard" replace />;
        case UserRole.Player:
            return <Navigate to="/player/dashboard" replace />;
        case UserRole.Umpire:
            return <Navigate to="/umpire/dashboard" replace />;
        case UserRole.Viewer:
            return <Navigate to="/" replace />;;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default RoleRedirect;