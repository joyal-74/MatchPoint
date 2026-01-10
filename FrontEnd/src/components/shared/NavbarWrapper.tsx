import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PlayerNavbar from "../player/Navbar";
import ManagerNavbar from "../manager/Navbar";
import ViewerNavbar from "../viewer/Navbar";

import type { RootState } from "../../app/rootReducer";
import type { FC, PropsWithChildren } from "react";

type Role = "player" | "manager" | "viewer";

type RoleComponentMap = Record<Role, FC<PropsWithChildren>>;

const navbars: RoleComponentMap = {
    player: PlayerNavbar,
    manager: ManagerNavbar,
    viewer: ViewerNavbar,
};

export default function NavbarWrapper({ children }: PropsWithChildren) {
    const userRole = useSelector(
        (state: RootState) => state.auth.user?.role
    ) as Role | undefined;

    if (!userRole) {
        return <Navigate to="/unauthorized" />;
    }

    const Navbar = navbars[userRole];

    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
