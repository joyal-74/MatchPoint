import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const AdminRouteProtect = ({ children }: Props) => {
    const { admin } = useAppSelector(state => state.auth);

    if (!admin) return <Navigate to="/admin/login" replace />;

    return children;
};

export default AdminRouteProtect;