import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import ProfileCard from "../shared/ProfileCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    
    const notificationCount = 0; 

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
        if (user?._id) {
            await dispatch(logoutUser({ userId: user._id, role: user.role })).unwrap();
            navigate("/admin/login");
        }
    };

    const handleProfileAction = (action: "logout" | "teams" | "profile" | 'settings' | 'tournaments') => {
        switch (action) {
            case "logout":
                handleLogout();
                break;
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-card border-b border-border shadow-sm transition-colors duration-300">

            {/* Logo Section */}
            <h1 className="text-foreground text-2xl font-rowdies font-bold tracking-wide select-none">
                <span className="text-primary">M</span>
                atch
                <span className="text-primary">P</span>
                oint
            </h1>

            {/* Actions Section */}
            <div className="flex items-center gap-4 relative">

                {/* Notification Bell */}
                <button
                    className="relative p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    
                    {/* FIXED: Only show if count > 0 */}
                    {notificationCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-card">
                            {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                    )}
                </button>

                {/* Profile Section */}
                <div ref={profileRef} className="relative">
                    <div
                        className="relative cursor-pointer group"
                        onClick={() => setShowProfileCard((prev) => !prev)}
                    >
                        <img
                            src="/placeholder.png"
                            alt="Profile"
                            className={`
                                w-9 h-9 rounded-full object-cover 
                                border-2 transition-all duration-200
                                ${showProfileCard
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-border group-hover:border-primary"
                                }
                            `}
                        />
                    </div>

                    {/* Dropdown Card */}
                    {showProfileCard && (
                        <div className="absolute right-0 mt-3 origin-top-right z-50 animate-in fade-in zoom-in-95 duration-200">
                            <ProfileCard role={'admin'} onAction={handleProfileAction} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;