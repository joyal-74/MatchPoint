import React from 'react'
import { FiGlobe, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';

interface ProfileCardProps {
    onAction: (action: "logout" | "teams" | "profile") => void;
    role : string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onAction, role }) => {

    return (
        <div className="w-40 bg-[var(--color-background)] text-white text-sm flex flex-col gap-1 rounded-md shadow-lg">
            <button onClick={() => onAction("profile")} className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] w-full text-left">
                <FiUser className="text-[var(--color-primary)] text-lg" />
                <span>Profile</span>
            </button>

            {role !== 'viewer' ? (
                <button
                    onClick={() => onAction("teams")}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)] w-full text-left"
                >
                    <FiUsers className="text-[var(--color-primary)] text-lg" />
                    <span>My Teams</span>
                </button>
            ) : null}

            <button className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)]  w-full text-left">
                <FiGlobe className="text-[var(--color-primary)] text-lg" />
                <span>Settings</span>
            </button>

            <button
                onClick={() => onAction("logout")}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-background-secondary)]  w-full text-left"
            >
                <FiLogOut className="text-[var(--color-primary)] text-lg" />
                <span>Logout</span>
            </button>
        </div>
    );
};


export default ProfileCard;