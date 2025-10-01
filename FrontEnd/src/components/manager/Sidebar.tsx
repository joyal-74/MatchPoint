import { type JSX } from "react";
import {
    User,
    CreditCard,
    Settings,
    Users2,
    DollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface MenuItem {
    name: string;
    path: string;
    icon: JSX.Element;
}

const Sidebar: React.FC = () => {

    const menuItems: MenuItem[] = [
        { name: "Profile", path: "/manager/profile", icon: <User size={20} /> },
        { name: "My Teams", path: "/manager/teams", icon: <Users2 size={20} /> },
        { name: "Subscription", path: "/manager/subscription", icon: <CreditCard size={20} /> },
        { name: "Payments", path: "/manager/payments", icon: <DollarSign size={20} /> },
        { name: "Settings", path: "/manager/settings", icon: <Settings size={20} /> },
    ];

    return (
        <aside className="fixed top-15 left-0 h-full w-65 bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] shadow-lg flex flex-col">
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 pl-20 py-4 text-sm font-medium transition-colors ${isActive
                                ? "text-[var(--color-link-hover)] font-semibold"
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                            }`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;