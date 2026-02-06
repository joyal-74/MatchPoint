import { lazy } from 'react';
import { Routes, Route } from "react-router-dom";

const AdminLoginPage = lazy(() => import('../pages/auth/AdminLogin'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const EnterAccountOtpPage = lazy(() => import('../pages/auth/EnterAccountOtpPage'));
const EnterForgotOtpPage = lazy(() => import('../pages/auth/EnterForgotOtpPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const PrivacyPolicy = lazy(() => import('../pages/shared/PrivacyPolicy'));
const SettingsPage = lazy(() => import('../pages/shared/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/player/NotificationsPage'));
const AllTimeLeaderboard = lazy(() => import('../pages/shared/LeaderBoard/AllTimeLeaderboard'));
const UserSubscriptionPage = lazy(() => import('../pages/shared/SubscriptionsPage'));

import NavbarWrapper from '../components/shared/NavbarWrapper';
import ViewerProfileLayout from '../pages/layout/ViewerProfileLayout';
import Blocked from '../pages/shared/Blocked';
import RoleLayoutWrapper from '../pages/shared/RoleLayoutWrapper';
import Unauthorized from '../pages/shared/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleRedirect from './RoleDirect';

const PublicRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
            <Route path="/privacy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/otp-verify" element={<PublicRoute><EnterAccountOtpPage /></PublicRoute>} />
            <Route path="/otp-verification" element={<PublicRoute><EnterForgotOtpPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

            {/* Role-based redirect */}
            <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
            <Route path="/:role/notifications" element={<ProtectedRoute><RoleLayoutWrapper><NotificationsPage /></RoleLayoutWrapper></ProtectedRoute>} />
            <Route path="/notifications" element={<ViewerProfileLayout><NotificationsPage /></ViewerProfileLayout>} />

            {/* Shared pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/blocked" element={<Blocked />} />
            
            <Route path="/:role/subscription" element={
                <ProtectedRoute><RoleLayoutWrapper><UserSubscriptionPage /></RoleLayoutWrapper></ProtectedRoute>
            } />
            <Route path="/subscription" element={<ViewerProfileLayout><UserSubscriptionPage /></ViewerProfileLayout>} />
            
            <Route path="/:role/settings" element={
                <ProtectedRoute allowedRoles={["player", "manager", "umpire"]}><RoleLayoutWrapper><SettingsPage /></RoleLayoutWrapper></ProtectedRoute>
            } />
            <Route path="/settings" element={<ViewerProfileLayout><SettingsPage /></ViewerProfileLayout>} />
            
            <Route path="/:role/leaderboard" element={
                <ProtectedRoute><NavbarWrapper><AllTimeLeaderboard /></NavbarWrapper></ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
                <ProtectedRoute><NavbarWrapper><AllTimeLeaderboard /></NavbarWrapper></ProtectedRoute>
            } />
        </Routes>
    );
};

export default PublicRoutes;