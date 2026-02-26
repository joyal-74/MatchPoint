import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { refreshToken } from "../../features/auth/authThunks";
import LoadingOverlay from "./LoadingOverlay";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { user, loading, isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isInitialized && !user) {
            dispatch(refreshToken('-')).catch(() => {
                console.log("AuthProvider: Handled guest session.");
            });
        }
    }, [dispatch, isInitialized, user]);

    if (loading && !isInitialized) {
        return <LoadingOverlay show={true} />;
    }

    return <>{children}</>;
};

export default AuthProvider;