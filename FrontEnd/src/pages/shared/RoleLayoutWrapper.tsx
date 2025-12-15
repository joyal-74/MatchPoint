import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PlayerLayout from "../layout/PlayerLayout";
import ManagerLayout from "../layout/ManagerLayout";
import ViewerLayout from "../layout/ViewerProfileLayout";
import type { RootState } from "../../app/rootReducer";
import type { FC, PropsWithChildren } from "react";


type Role = "player" | "manager" | "viewer";

const layouts: Record<Role, FC<PropsWithChildren>> = {
    player: PlayerLayout,
    manager: ManagerLayout,
    viewer: ViewerLayout,
};

export default function RoleLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { role } = useParams();
    const userRole = useSelector((state :RootState) => state.auth.user?.role);

    if (!role || !["player", "manager", "viewer"].includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    if (userRole !== role) {
        return <Navigate to="/unauthorized" />;
    }

    const Layout = layouts[role as Role];
    return <Layout>{children}</Layout>;
}
