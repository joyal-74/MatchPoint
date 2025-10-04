import { BrowserRouter, Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./publicRoutes";
import { playerRoutes } from "./PlayerRoutes";
import { managerRoutes } from "./ManagerRoutes";
import NotFoundPage from "../pages/shared/PageNotFound";
import Unauthorized from "../pages/shared/Unauthorized";
import UserProfile from "../components/viewer/ProfileSection";
import PlayerProfile from "../pages/player/Profile";


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

                <Route path="*" element={<NotFoundPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/profile1" element={<PlayerProfile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;