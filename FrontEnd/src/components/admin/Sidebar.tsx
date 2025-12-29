import { type JSX } from "react";
import {
    LayoutDashboard,
    Trophy,
    Users,
    User,
    UserCog,
    DollarSign,
    Layers,
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
        { name: "Teams", path: "/admin/teams", icon: <Layers size={20} /> },
        { name: "Tournaments", path: "/admin/tournaments", icon: <Trophy size={20} /> },
        { name: "Subscriptions", path: "/admin/subscriptions", icon: <DollarSign size={20} /> },
    ];

    return (
        <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-16 lg:w-64 bg-card border-r border-border transition-all duration-300">
            <nav className="h-full flex flex-col gap-1 p-2 lg:p-4 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                            ${isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                            justify-center lg:justify-start`
                        }
                    >
                        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                            {item.icon}
                        </span>
                        
                        <span className="hidden lg:block truncate">
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;