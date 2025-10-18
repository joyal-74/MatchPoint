import { type JSX } from "react";
import {
    LayoutDashboard,
    Trophy,
    Users,
    User,
    UserCog,
    DollarSign,
    Layers,
    Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface MenuItem {
    name: string;
    path: string;
    icon: JSX.Element;
}

const Sidebar: React.FC = () => {

    const menuItems: MenuItem[] = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Viewers", path: "/admin/viewers", icon: <Users size={20} /> },
        { name: "Players", path: "/admin/players", icon: <User size={20} /> },
        { name: "Managers", path: "/admin/managers", icon: <UserCog size={20} /> },
        { name: "Subscriptions", path: "/admin/subscriptions", icon: <DollarSign size={20} /> },
        { name: "Sports", path: "/admin/sports", icon: <Shield size={20} /> },
        { name: "Teams", path: "/admin/teams", icon: <Layers size={20} /> },
        { name: "Tournaments", path: "/admin/tournaments", icon: <Trophy size={20} /> },
    ];

    return (
        <aside className="fixed top-15 left-0 h-full w-15 lg:w-65 bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] shadow-lg flex flex-col">
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 pl-5 lg:pl-20 py-4 text-sm font-medium transition-colors ${isActive
                                ? "text-[var(--color-link-hover)] font-semibold"
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                            }`
                        }
                    >
                        {item.icon}
                        <span className="hidden lg:inline">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;