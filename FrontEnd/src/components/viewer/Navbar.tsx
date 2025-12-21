import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import ProfileCard from "../shared/ProfileCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../shared/LoadingOverlay";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDropdown from "../player/notifications/NotificationDropdown";

const Navbar: React.FC = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading } = useAppSelector((state) => state.auth);
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
        await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
        navigate("/login");
    };

    const handleProfileAction = (action: "logout" | "teams" | "profile" | "settings") => {
        switch (action) {
            case "logout":
                handleLogout();
                break;
            case "profile":
                navigate("/profile");
                break;
            case "settings":
                navigate("/settings");
                break;
        }
    };

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Tournaments", path: "/tournaments" },
        { name: "Teams", path: "/teams" },
        { name: "Live", path: "/live" },
        { name: "Leaderboard", path: "/leaderboard" },
    ];

    return (
        <div>
            loading && !user ? <LoadingOverlay show={loading} />
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <h1 className="text-[var(--color-text-primary)] text-2xl font-rowdies">
                    <span className="text-[var(--color-primary)]">M</span>
                    atch
                    <span className="text-[var(--color-primary)]">P</span>
                    oint
                </h1>

                <ul className="hidden md:flex gap-8 lg:gap-12 ml-12 text-sm font-medium">
                    {menuItems.map(item => (
                        <li key={item.path}>
                            <h1 onClick={() => navigate(item.path)} className={`${location.pathname === item.path ? 'text-[var(--color-primary)] font-semibold' :
                                'text-[var(--color-text-secondary)]'} hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer`}>
                                {item.name}
                            </h1>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3 md:gap-4 relative">
                    <button
                        onClick={toggleNotifications}
                        className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-full transition-all duration-200"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-600 text-xs px-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <div ref={profileRef}>
                        <img
                            src={user?.profileImage || 'placeholder.png'}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                            onClick={() => setShowProfileCard((prev) => !prev)}
                        />

                        {showProfileCard && (
                            <div className="absolute right-0 mt-2">
                                <ProfileCard role={role} onAction={handleProfileAction} />
                            </div>
                        )}
                    </div>
                </div>

                {showNotifications && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/0"
                            onClick={closeNotifications}
                        />
                        <div className="absolute right-0 top-12 w-96 z-50">
                            <NotificationDropdown onClose={closeNotifications} role={role} />
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
