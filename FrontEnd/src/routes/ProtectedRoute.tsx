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

const ProtectedRoute = ({
    children,
    allowedRoles = [],
    requireAuth = true,
    redirectTo = "/login"
}: ProtectedRouteProps) => {
    const { loading, isInitialized, user } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!isInitialized || loading) {
        return <LoadingOverlay show={true} />;
    }

    const isAuthenticated = !!user;

    if (!requireAuth && isAuthenticated) {
        const from = location.state?.from?.pathname || getDefaultRoute(user!.role);
        return <Navigate to={from} replace />;
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (user?.isActive === false) {
        return <Navigate to="/blocked" replace />;
    }

    if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

// Helper function to get default routes
const getDefaultRoute = (role: UserRole): string => {
    switch (role) {
        case 'admin': return '/admin/dashboard';
        case 'player': return '/player/dashboard';
        case 'manager': return '/manager/dashboard';
        case 'viewer': return '/';
        default: return '/';
    }
};

export default ProtectedRoute;




