import { lazy, Suspense, type JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const EnterAccountOtpPage = lazy(() => import('../pages/auth/EnterAccountOtpPage'));
const EnterForgotOtpPage = lazy(() => import('../pages/auth/EnterForgotOtpPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Shared Pages
const PrivacyPolicy = lazy(() => import('../pages/shared/PrivacyPolicy'));
const SettingsPage = lazy(() => import('../pages/shared/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/shared/NotificationsPage'));
const AllTimeLeaderboard = lazy(() => import('../pages/shared/LeaderBoard/AllTimeLeaderboard'));
const UserSubscriptionPage = lazy(() => import('../pages/shared/SubscriptionsPage'));
const Blocked = lazy(() => import('../pages/shared/Blocked'));
const Unauthorized = lazy(() => import('../pages/shared/Unauthorized'));

// Viewer Specific Pages
const Home = lazy(() => import("../pages/viewer/Home"));
const LiveMatchPage = lazy(() => import("../pages/viewer/match/LiveMatchPage"));
const LiveMatches = lazy(() => import("../pages/viewer/LiveMatches"));
const ProfilePage = lazy(() => import("../pages/viewer/ProfilePage"));
const LiveStreamViewer = lazy(() => import("../pages/viewer/LiveStreamViewer"));
const WalletPage = lazy(() => import("../pages/shared/PaymentsPage"));
const FinancialHistory = lazy(() => import("../pages/shared/FinancialHistory"));
const TournamentsPage = lazy(() => import("../pages/viewer/Tournaments"));
const TournamentDetails = lazy(() => import("../pages/viewer/TournamentDetailsPage"));

// Components & Layouts
import NavbarWrapper from '../components/shared/NavbarWrapper';
import ViewerProfileLayout from '../pages/layout/ViewerProfileLayout';
import LoadingOverlay from '../components/shared/LoadingOverlay';

// Logic & Protection
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleRedirect from './RoleDirect';

const withViewerProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["viewer", "admin", "player", "manager", "umpire"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

const RootModule = () => {
    return (
        <Suspense fallback={<LoadingOverlay show />}>
            <Routes>
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="otp-verify" element={<PublicRoute><EnterAccountOtpPage /></PublicRoute>} />
                <Route path="otp-verification" element={<PublicRoute><EnterForgotOtpPage /></PublicRoute>} />
                <Route path="reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

                <Route path="/" element={withViewerProtection(<Home />)} />
                <Route path="profile" element={withViewerProtection(<ProfilePage />)} />
                <Route path="tournaments" element={withViewerProtection(<TournamentsPage />)} />
                <Route path="tournaments/:id" element={withViewerProtection(<TournamentDetails />)} />
                <Route path="live" element={withViewerProtection(<LiveMatches />)} />
                <Route path="live/:matchId/details" element={withViewerProtection(<LiveMatchPage />)} />
                <Route path="live/:matchId/details/stream" element={withViewerProtection(<LiveStreamViewer />)} />
                <Route path="payments" element={withViewerProtection(<WalletPage />)} />
                <Route path="payments/history" element={withViewerProtection(<FinancialHistory />)} />

                <Route path="/notifications" element={withViewerProtection(<ViewerProfileLayout><NotificationsPage /></ViewerProfileLayout>)} />
                <Route path="/settings" element={withViewerProtection(<ViewerProfileLayout><SettingsPage /></ViewerProfileLayout>)} />
                <Route path="/subscription" element={withViewerProtection(<ViewerProfileLayout><UserSubscriptionPage /></ViewerProfileLayout>)} />
                <Route path="/leaderboard" element={withViewerProtection(<NavbarWrapper><AllTimeLeaderboard /></NavbarWrapper>)} />

                <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/blocked" element={<Blocked />} />

                <Route path="*" element={<Navigate to="/404" replace />} />

            </Routes>
        </Suspense>
    );
};

export default RootModule;