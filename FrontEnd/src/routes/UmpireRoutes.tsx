import { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import RoleLayoutWrapper from "../pages/shared/RoleLayoutWrapper";

// Lazy loaded umpire pages
const UmpireLandingPage = lazy(() => import("../pages/umpire/UmpireLandingPage"));
const MatchCenter = lazy(() => import("../pages/umpire/MatchCenter"));
const MatchDetails = lazy(() => import("../pages/umpire/MatchDetails"));
const SubscriptionsPage = lazy(() => import("../pages/shared/SubscriptionsPage"));
const ScoreboardDashboard = lazy(() => import("../pages/umpire/scoreControl/ScoreboardDashboard"));
const ProfilePage = lazy(() => import("../pages/umpire/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/shared/SettingsPage"));
const WalletPage = lazy(() => import("../pages/shared/PaymentsPage"));
const FinancialHistory = lazy(() => import("../pages/shared/FinancialHistory"));


const withUmpireProtection = (component: JSX.Element) => (
    <ProtectedRoute allowedRoles={["umpire"]}>
        <Suspense fallback={<LoadingOverlay show />}>
            {component}
        </Suspense>
    </ProtectedRoute>
);

const UmpireRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={withUmpireProtection(<UmpireLandingPage />)} />
            <Route path="profile" element={withUmpireProtection(<ProfilePage />)} />
            <Route path="matches" element={withUmpireProtection(<MatchCenter />)} />
            <Route path="matches/details" element={withUmpireProtection(<MatchDetails />)} />
            <Route path="subscription" element={withUmpireProtection(<RoleLayoutWrapper><SubscriptionsPage /></RoleLayoutWrapper>)} />
            <Route path="matches/:matchId/live-score" element={withUmpireProtection(<ScoreboardDashboard />)} />
            <Route path="payments" element={withUmpireProtection(<WalletPage />)} />
            <Route path="payments/history" element={withUmpireProtection(<FinancialHistory />)} />
            
            <Route path="settings" element={withUmpireProtection(
                    <RoleLayoutWrapper>
                        <SettingsPage />
                    </RoleLayoutWrapper>
                )} 
            />
        </Routes>
    );
};

export default UmpireRoutes;