import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, User } from 'lucide-react';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define mobile navigation items
    const navItems = [
        { name: 'Home', path: '/umpire/dashboard', icon: Home },
        { name: 'Matches', path: '/umpire/tournaments', icon: Trophy },
        { name: 'My matches', path: '/umpire/teams', icon: Users },
        { name: 'Profile', path: '/umpire/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe-area">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                                isActive 
                                    ? 'text-primary' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Icon 
                                size={isActive ? 24 : 22} 
                                strokeWidth={isActive ? 2.5 : 2}
                                className="transition-all duration-200"
                            />
                            <span className="text-[10px] font-medium">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;