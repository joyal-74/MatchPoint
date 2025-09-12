import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
    allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: Props) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleBasedRoute;