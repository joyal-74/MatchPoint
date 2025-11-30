import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PlayerLayout from "../layout/PlayerLayout";
import ManagerLayout from "../layout/ManagerLayout";
import ViewerLayout from "../layout/ViewerProfileLayout";
import type { RootState } from "../../app/rootReducer";

type Role = "player" | "manager" | "viewer";

const layouts: Record<Role, any> = {
    player: PlayerLayout,
    manager: ManagerLayout,
    viewer: ViewerLayout,
};

export default function RoleLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { role } = useParams();
    const userRole = useSelector((state :RootState) => state.auth.user?.role);

    // Validate role param
    if (!role || !["player", "manager", "viewer"].includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    // Validate logged-in user's role
    if (userRole !== role) {
        return <Navigate to="/unauthorized" />;
    }

    const Layout = layouts[role as Role];
    return <Layout>{children}</Layout>;
}
