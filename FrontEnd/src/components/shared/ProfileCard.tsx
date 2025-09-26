import React from 'react'
import { FiGlobe, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';

interface SidebarMenuProps {
    onLogout: () => void;
}

const ProfileCard: React.FC<SidebarMenuProps> = ({ onLogout }) => {
    
    return (
        <div className="w-40 bg-[var(--color-background)] text-white text-sm flex flex-col gap-1 rounded-md shadow-lg">
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] rounded-md w-full text-left">
                <FiUser className="text-[var(--color-primary)] text-lg" />
                <span>Profile</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] rounded-md w-full text-left">
                <FiUsers className="text-[var(--color-primary)] text-lg" />
                <span>My Teams</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] rounded-md w-full text-left">
                <FiGlobe className="text-[var(--color-primary)] text-lg" />
                <span>Settings</span>
            </button>

            <button
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] rounded-md w-full text-left"
            >
                <FiLogOut className="text-[var(--color-primary)] text-lg" />
                <span>Logout</span>
            </button>
        </div>
    );
};


export default ProfileCard;