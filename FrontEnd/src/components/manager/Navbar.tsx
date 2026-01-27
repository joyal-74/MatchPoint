import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import ProfileCard from "../shared/ProfileCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDropdown from "../shared/notifications/NotificationDropdown";
import ManagerBottomNav from "./ManagerBottomNav";

const Navbar: React.FC = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role ?? "guest";

    const {
        unreadCount,
        isOpen: showNotifications,
        toggle: toggleNotifications,
        close: closeNotifications
    } = useNotifications(user?._id);

    useEffect(() => {
        closeNotifications();
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileCard(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
            if (user?.role === 'admin') navigate("/admin/login");
            else navigate("/login");
        } catch (error) { console.error("Logout failed:", error); }
    };

    const handleProfileAction = (action: "logout" | "teams" | "profile" | 'settings') => {
        switch (action) {
            case "logout": handleLogout(); break;
            case "teams": navigate("/manager/teams"); break;
            case "profile": navigate("/manager/profile"); break;
            case "settings": navigate("/manager/settings"); break;
        }
    };

    const menuItems = [
        { name: "Home", path: "/manager/dashboard" },
        { name: "Tournaments", path: "/manager/tournaments" },
        { name: "Explore", path: "/manager/explore" },
        { name: "Matches", path: "/manager/matches" },
    ];

    return (
        <>
            {/* --- TOP NAVBAR --- */}
            {/* Added h-[60px] to strictly enforce height for alignment with Sidebar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-4 md:px-10 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-colors duration-300">
                <div className="flex items-center gap-12">
                    <h1 className="text-foreground text-xl md:text-2xl font-rowdies cursor-pointer" onClick={() => navigate('/manager/dashboard')}>
                        <span className="text-primary">M</span>atch<span className="text-primary">P</span>oint
                    </h1>

                    <ul className="hidden md:flex gap-8 lg:gap-12 text-sm font-medium">
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`${location.pathname === item.path ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'} transition-colors duration-200 cursor-pointer`}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3 md:gap-4 relative">
                    <button
                        onClick={toggleNotifications}
                        className={`relative p-2 rounded-full transition-all duration-200 ${showNotifications ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <div ref={profileRef} className="relative hidden md:block">
                        <img
                            src={user?.profileImage || '/placeholder.png'}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors duration-200 cursor-pointer object-cover"
                            onClick={() => setShowProfileCard((prev) => !prev)}
                        />
                        {showProfileCard && (
                            <div className="absolute right-0 mt-2 w-64 origin-top-right z-50">
                                <ProfileCard role={user?.role || 'guest'} onAction={handleProfileAction} />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Notifications Panel */}
            {showNotifications && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-transparent"
                        onClick={closeNotifications}
                    />
                    <div className={`
                        z-[70]
                        fixed inset-y-0 right-0 w-full sm:w-85
                        bg-background shadow-2xl border-l border-border
                        animate-in slide-in-from-right duration-300
                        pb-20 md:pb-0
                        md:fixed md:inset-auto md:top-16 md:right-10 md:w-auto md:h-auto 
                        md:bg-transparent md:shadow-none md:border-none
                        md:animate-in md:zoom-in-95 md:duration-200
                    `}>
                        <NotificationDropdown onClose={closeNotifications} role={role} />
                    </div>
                </>
            )}

            <div className="mt-12"></div>

            <ManagerBottomNav />
        </>
    );
};

export default Navbar;