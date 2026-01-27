import { BrowserRouter, Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { playerRoutes } from "./PlayerRoutes";
import { managerRoutes } from "./ManagerRoutes";
import NotFoundPage from "../pages/shared/PageNotFound";
import { viewerRoutes } from "./ViewerRoutes";
import { publicRoutes } from "./publicRoutes"; 
import { umpireRoutes } from "./UmpireRoutes";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {adminRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {playerRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {managerRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {viewerRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {umpireRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;