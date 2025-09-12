import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {adminRoutes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <ProtectedRoute>
                                <RoleBasedRoute allowedRoles={["admin"]}>
                                    {element}
                                </RoleBasedRoute>
                            </ProtectedRoute>
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
