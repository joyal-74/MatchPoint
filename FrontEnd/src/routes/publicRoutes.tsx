import NavbarWrapper from '../components/shared/NavbarWrapper';
import SettingsPage from '../components/shared/SettingsPage';
import AdminLoginPage from '../pages/auth/AdminLogin';
import EnterAccountOtpPage from '../pages/auth/EnterAccountOtpPage';
import EnterForgotOtpPage from '../pages/auth/EnterForgotOtpPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SignupPage from '../pages/auth/SignupPage';
import ViewerProfileLayout from '../pages/layout/ViewerProfileLayout';
import NotificationsPage from '../pages/player/NotificationsPage';
import Blocked from '../pages/shared/Blocked';
import AllTimeLeaderboard from '../pages/shared/LeaderBoard/AllTimeLeaderboard';
import RoleLayoutWrapper from '../pages/shared/RoleLayoutWrapper';
import UserSubscriptionPage from '../pages/shared/SubscriptionsPage';
import Unauthorized from '../pages/shared/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleRedirect from './RoleDirect';


export const publicRoutes = [
    // Public routes 
    { path: "/admin/login", element: <PublicRoute><AdminLoginPage /></PublicRoute> },
    { path: "/login", element: <PublicRoute ><LoginPage /></PublicRoute> },
    { path: "/signup", element: <PublicRoute><SignupPage /></PublicRoute> },
    { path: "/forgot-password", element: <PublicRoute><ForgotPasswordPage /></PublicRoute> },
    { path: "/otp-verify", element: <PublicRoute><EnterAccountOtpPage /></PublicRoute> },
    { path: "/otp-verification", element: <PublicRoute><EnterForgotOtpPage /></PublicRoute> },
    { path: "/reset-password", element: <PublicRoute><ResetPasswordPage /></PublicRoute> },

    // Role-based redirect
    { path: "/dashboard", element: <ProtectedRoute><RoleRedirect /></ProtectedRoute> },
    { path: "/:role/notifications", element: <ProtectedRoute><RoleLayoutWrapper><NotificationsPage /></RoleLayoutWrapper></ProtectedRoute> },
    { path: "/notifications", element: <ViewerProfileLayout><NotificationsPage /></ViewerProfileLayout> },

    // Shared pages
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "/blocked", element: <Blocked /> },
    {
        path: "/:role/subscription",
        element: (
            <ProtectedRoute>
                <RoleLayoutWrapper>
                    <UserSubscriptionPage />
                </RoleLayoutWrapper>
            </ProtectedRoute>
        )
    },
    {
        path: "/subscription",
        element: (<ViewerProfileLayout><UserSubscriptionPage /></ViewerProfileLayout>)
    },
    {
        path: "/:role/settings",
        element: (
            <ProtectedRoute allowedRoles={["player", "manager"]}>
                <RoleLayoutWrapper>
                    <SettingsPage />
                </RoleLayoutWrapper>
            </ProtectedRoute>
        )
    },
    {
        path: "/settings",
        element: (<ViewerProfileLayout><SettingsPage /></ViewerProfileLayout>)
    },
    {
        path: "/:role/leaderboard",
        element: (
            <ProtectedRoute>
                <NavbarWrapper>
                    <AllTimeLeaderboard />
                </NavbarWrapper>
            </ProtectedRoute>
        )
    },
    {
        path: "/leaderboard",
        element: (
            <ProtectedRoute>
                <NavbarWrapper>
                    <AllTimeLeaderboard />
                </NavbarWrapper>
            </ProtectedRoute>
        )
    }
];