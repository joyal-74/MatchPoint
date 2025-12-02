import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PlayerNavbar from './../player/Navbar'
import ManagerNavbar from './../manager/Navbar'
import ViewerNavbar from './../viewer/Navbar'

import type { RootState } from "../../app/rootReducer";
import type { FC, PropsWithChildren } from "react";

type RoleComponentMap = Record<Role, FC<PropsWithChildren>>;

type Role = "player" | "manager" | "viewer";

const navbars: RoleComponentMap = {
    player: PlayerNavbar,
    manager: ManagerNavbar,
    viewer: ViewerNavbar,
};

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const { role } = useParams();
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    // Role validation
    if (!role || !["player", "manager", "viewer"].includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    // Prevent wrong role access
    if (userRole !== role) {
        return <Navigate to="/unauthorized" />;
    }

    const Navbar = navbars[role as Role];

    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
