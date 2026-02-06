import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "../components/shared/LoadingOverlay"; 
import NotFoundPage from "../pages/shared/PageNotFound";

// Lazy load the route components
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const PlayerRoutes = lazy(() => import("./PlayerRoutes"));
const ManagerRoutes = lazy(() => import("./ManagerRoutes"));
const ViewerRoutes = lazy(() => import("./ViewerRoutes"));
const UmpireRoutes = lazy(() => import("./UmpireRoutes"));

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingOverlay show />}>
                <Routes>
    
                    <Route path="/*" element={<PublicRoutes />} />
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="/player/*" element={<PlayerRoutes />} />
                    <Route path="/manager/*" element={<ManagerRoutes />} />
                    <Route path="/viewer/*" element={<ViewerRoutes />} />
                    <Route path="/umpire/*" element={<UmpireRoutes />} />
                    
                    {/* Fallback for unknown routes */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;