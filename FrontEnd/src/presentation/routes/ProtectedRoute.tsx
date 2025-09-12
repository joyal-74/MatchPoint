import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const { user } = useAppSelector(state => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
