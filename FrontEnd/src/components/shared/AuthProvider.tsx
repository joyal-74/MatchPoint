import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { refreshToken } from "../../features/auth/authThunks";
import LoadingOverlay from "./LoadingOverlay";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useAppDispatch();
    const { user, loading, isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const initializeAuth = async () => {
            if (!user) {
                try {
                    await dispatch(refreshToken()).unwrap();
                } catch (error) {
                    console.log("Refresh token failed:", error);
                }
            }
        };

        initializeAuth();
    }, [dispatch, user]);

    if (loading && !isInitialized) {
        return <LoadingOverlay show={true} />;
    }

    return <>{children}</>;
};

export default AuthProvider;