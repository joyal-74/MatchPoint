import React from 'react';
import { FiGlobe, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';

interface ProfileCardProps {
    onAction: (action: "logout" | "teams" | "profile" | "settings") => void;
    role: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onAction, role }) => {
    return (
        <div className="w-50 bg-card text-foreground text-sm flex flex-col rounded-xl shadow-xl border border-border overflow-hidden">
            
            {/* Main Menu Items */}
            <div className="p-1.5 flex flex-col gap-0.5">
                <button
                    onClick={() => onAction("profile")}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg w-full text-left transition-colors duration-150"
                >
                    <FiUser className="text-primary text-lg" />
                    <span className="font-medium">Profile</span>
                </button>

                {role !== 'viewer' && role !== 'admin' && (
                    <button
                        onClick={() => onAction("teams")}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg w-full text-left transition-colors duration-150"
                    >
                        <FiUsers className="text-primary text-lg" />
                        <span className="font-medium">My Teams</span>
                    </button>
                )}

                <button
                    onClick={() => onAction('settings')}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg w-full text-left transition-colors duration-150"
                >
                    <FiGlobe className="text-primary text-lg" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mx-2" />

            {/* Logout Section */}
            <div className="p-1.5">
                <button
                    onClick={() => onAction("logout")}
                    className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg w-full text-left transition-colors duration-150 group"
                >
                    <FiLogOut className="text-lg group-hover:text-destructive transition-colors" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;