import { BrowserRouter, Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./publicRoutes";


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
                        element={element}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
