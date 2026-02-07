import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PlayerLayout from "../layout/PlayerLayout";
import ManagerLayout from "../layout/ManagerLayout";
import type { RootState } from "../../app/rootReducer";
import type { FC, PropsWithChildren } from "react";
import ViewerProfileLayout from "../layout/ViewerProfileLayout";
import UmpireLayoutNavbar from "../layout/UmpireLayout";

type Role = "player" | "manager" | "viewer" | "umpire";

const layouts: Record<Role, FC<PropsWithChildren>> = {
    player: PlayerLayout,
    manager: ManagerLayout,
    viewer: ViewerProfileLayout,
    umpire: UmpireLayoutNavbar,
};

export default function RoleLayoutWrapper({ children }: { children: React.ReactNode }) {
    const userRole = useSelector((state: RootState) => state.auth.user?.role) as Role | undefined;

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    if (!layouts[userRole]) {
        return <Navigate to="/unauthorized" />;
    }

    const Layout = layouts[userRole];
    
    return <Layout>{children}</Layout>;
}