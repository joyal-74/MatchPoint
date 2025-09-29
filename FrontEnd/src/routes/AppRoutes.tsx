import { BrowserRouter, Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./publicRoutes";
import { playerRoutes } from "./PlayerRoutes";
import { managerRoutes } from "./ManagerRoutes";
import NotFoundPage from "../pages/shared/PageNotFound";
import Unauthorized from "../pages/shared/Unauthorized";
import UserProfile from "../components/viewer/ProfileSection";
import PlayerLanding from "../pages/player/LandingPage";
import PlayerProfile from "../pages/player/Profile";
import TournamentsPage from "../pages/manager/TournamentsPage";
import TournamentDetailsPage from "../components/manager/tournaments/TournamentDetails"; 
import TeamsListPage from "../pages/manager/TeamsListPage";
import ManageMembersPage from "../pages/manager/ManageMembers";


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
                <Route path="/landing" element={<PlayerLanding />} />
                <Route path="/player/tournament" element={<TournamentsPage />} />
                <Route path="/player/teams" element={<TeamsListPage />} />
                <Route path="/player/teams/members" element={<ManageMembersPage teamId={13453} />} />
                <Route path="/player/tournament/details" element={<TournamentDetailsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;