import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import ProfileCard from "../shared/ProfileCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDropdown from "../player/notifications/NotificationDropdown";

const Navbar: React.FC = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Used for active state check
    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role ?? "guest";

    const {
        unreadCount,
        isOpen: showNotifications,
        toggle: toggleNotifications,
        close: closeNotifications
    } = useNotifications(user?._id);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setShowProfileCard(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileCard]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
            if (user?.role === 'admin') {
                navigate("/admin/login");
            }
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleProfileAction = (action: "logout" | "teams" | "profile" | 'settings') => {
        switch (action) {
            case "logout":
                handleLogout();
                break;
            case "teams":
                navigate("/manager/teams");
                break;
            case "profile":
                navigate("/manager/profile");
                break;
            case "settings":
                navigate("/manager/settings");
                break;
        }
    };

    const menuItems = [
        { name: "Home", path: "/manager/dashboard" },
        { name: "Tournaments", path: "/manager/tournaments" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-colors duration-300">
                <div className="flex items-center justify-between w-1/3">
                    {/* Logo Section */}
                    <h1 className="text-foreground text-2xl font-rowdies cursor-pointer" onClick={() => navigate('/manager/dashboard')}>
                        <span className="text-primary">M</span>atch
                        <span className="text-primary">P</span>oint
                    </h1>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex gap-8 lg:gap-12 ml-12 text-sm font-medium">
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`${location.pathname === item.path
                                            ? 'text-primary font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                        } transition-colors duration-200 cursor-pointer`}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 md:gap-4 relative">
                    {/* Notification Bell */}
                    <button
                        onClick={toggleNotifications}
                        className={`relative p-2 rounded-full transition-all duration-200 
                            ${showNotifications 
                                ? 'bg-accent text-accent-foreground' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <img
                            src={user?.profileImage || '/placeholder.png'}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors duration-200 cursor-pointer object-cover"
                            onClick={() => setShowProfileCard((prev) => !prev)}
                        />

                        {showProfileCard && (
                            <div className="absolute right-0 mt-2 w-64 origin-top-right">
                                <ProfileCard role={user?.role || 'guest'} onAction={handleProfileAction} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Notification Dropdown Container */}
                {showNotifications && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/0"
                            onClick={closeNotifications}
                        />
                        <div className="absolute right-6 md:right-20 top-16 w-80 md:w-96 z-50">
                            <NotificationDropdown onClose={closeNotifications} role={role} />
                        </div>
                    </>
                )}
            </nav>
            
            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-[60px]" /> 
        </>
    );
};

export default Navbar;