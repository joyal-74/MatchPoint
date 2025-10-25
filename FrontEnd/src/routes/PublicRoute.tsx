import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';
import LoadingOverlay from '../components/shared/LoadingOverlay';
import type { UserRole } from '../types/UserRoles';

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { loading, isInitialized, user } = useAppSelector((state) => state.auth);

    if (!isInitialized || loading) {
        return <LoadingOverlay show={true} />;
    }

    if (user && user.isActive) {
        const redirectPath = getDefaultRoute(user.role);
        return <Navigate to={redirectPath} replace />;
    }

    if (user && user.isActive === false) {
        return <Navigate to="/blocked" replace />;
    }

    return <>{children}</>;
};

// Helper to get the correct dashboard route
const getDefaultRoute = (role: UserRole): string => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'player':
            return '/player/dashboard';
        case 'manager':
            return '/manager/dashboard';
        case 'viewer':
            return '/';
        default:
            return '/';
    }
};

export default PublicRoute;