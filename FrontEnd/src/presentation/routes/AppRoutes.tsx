import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./AdminRoutes";
import AdminRouteProtect from "./AdminRouteProtect";

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
                            <AdminRouteProtect >
                                {element}
                            </AdminRouteProtect>
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
