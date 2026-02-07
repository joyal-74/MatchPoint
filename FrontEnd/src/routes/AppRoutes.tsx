import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "../components/shared/LoadingOverlay";
import NotFoundPage from "../pages/shared/PageNotFound";
import Blocked from "../pages/shared/Blocked";
import Unauthorized from "../pages/shared/Unauthorized";

// Lazy load the route components
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const PlayerRoutes = lazy(() => import("./PlayerRoutes"));
const ManagerRoutes = lazy(() => import("./ManagerRoutes"));
const UmpireRoutes = lazy(() => import("./UmpireRoutes"));
const RootModule = lazy(() => import("./RootModule"));

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingOverlay show />}>
                <Routes>
                    {/* 1. Specific Role Prefixes (High Priority) */}
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="/player/*" element={<PlayerRoutes />} />
                    <Route path="/manager/*" element={<ManagerRoutes />} />
                    <Route path="/umpire/*" element={<UmpireRoutes />} />

                    <Route path="/blocked" element={<Blocked />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />


                    <Route path="/*" element={<RootModule />} />
                    {/* Fallback */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;