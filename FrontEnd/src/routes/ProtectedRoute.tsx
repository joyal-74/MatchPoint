import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';
import type { UserRole } from '../types/UserRoles';
import LoadingOverlay from '../components/shared/LoadingOverlay';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
    redirectTo?: string;
}

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true, redirectTo = "/login" }: ProtectedRouteProps) => {
    const { loading, isInitialized, user } = useAppSelector((state) => state.auth);
    const location = useLocation();


    if (!isInitialized || loading) {
        return <LoadingOverlay show={true} />;
    }

    const isAuthenticated = !!user;
    const currentUserRole = user?.role;


    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && currentUserRole && !allowedRoles.includes(currentUserRole)) {
        switch (currentUserRole) {
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'player':
                return <Navigate to="/player/dashboard" replace />;
            case 'manager':
                return <Navigate to="/manager/dashboard" replace />;
            case 'viewer':
                return <Navigate to="/viewer/dashboard" replace />;
            default:
                return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;