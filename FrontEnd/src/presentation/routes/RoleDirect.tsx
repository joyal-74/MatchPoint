import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Home from "../pages/viewer/Home";
import { UserRole } from "../../core/domain/types/UserRoles";

const RoleRedirect = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Home />;

  switch (user.role) {
    case UserRole.Viewer:
      return <Home />;
    case UserRole.Admin:
      return <Navigate to="/admin/dashboard" replace />;
    case UserRole.Manager:
      return <Navigate to="/manager/dashboard" replace />;
    case UserRole.Player:
      return <Navigate to="/player/dashboard" replace />;
    default:
      return <Home />;
  }
};

export default RoleRedirect;