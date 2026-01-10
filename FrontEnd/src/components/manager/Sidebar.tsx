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
        <aside className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-16 lg:w-64 bg-background border-r border-border text-foreground transition-colors duration-300 z-40 hidden md:flex flex-col">
            <nav className="flex-1 mt-6 px-3 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-all duration-200
                            ${isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {item.icon}
                                </span>
                                <span className="hidden lg:inline">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            
            {/* Optional: Footer or User Info could go here */}
            <div className="p-4 border-t border-border mt-auto hidden lg:block">
                <p className="text-xs text-muted-foreground">© 2024 MatchPoint</p>
            </div>
        </aside>
    );
};

export default Sidebar;