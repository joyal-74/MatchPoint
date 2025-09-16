import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

const GuestRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAppSelector((state) => state.auth);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestRoute;