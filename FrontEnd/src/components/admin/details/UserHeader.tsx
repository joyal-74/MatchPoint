import type { UserDetails } from "../../../features/admin/users/userTypes";
import { Calendar, Shield } from "lucide-react";
import StatusBadge from "../../ui/StatusBadge";
import StatusButton from "../../ui/StatusButton";

interface UserHeaderProps {
    user: UserDetails;
    onToggleBlock: () => void;
}

const UserHeader = ({ user, onToggleBlock }: UserHeaderProps) => {
    // Determine active state based on blocked status
    const isActive = !user.isBlocked;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* 1. Avatar Section */}
            <div className="relative shrink-0">
                <div className="p-1 rounded-full border-2 border-border bg-card">
                    <img
                        src={user.profileImage || '/office-worker.png'}
                        alt={`${user.fullName} profile`}
                        className="w-24 h-24 rounded-full object-cover bg-muted"
                    />
                </div>
            </div>

            {/* 2. Info Section */}
            <div className="flex-1 text-center sm:text-left space-y-2">
                
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {user.fullName}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    
                    {/* Role Badge (Custom style for role) */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border capitalize">
                        <Shield size={12} className="text-primary" />
                        {user.role}
                    </span>

                    {/* Status Badge (Reusable Component) */}
                    <StatusBadge isActive={isActive} />
                </div>

                {/* Date Row */}
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Joined: {new Date(user.joinedAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* 3. Action Section */}
            <div className="shrink-0 mt-4 sm:mt-0">
                <StatusButton
                    isActive={isActive}
                    onBlock={onToggleBlock}
                    onActivate={onToggleBlock}
                    showText={true}
                    className="w-full sm:w-auto px-6 py-2.5 shadow-sm" 
                    size={18}
                />
            </div>
        </div>
    );
};

export default UserHeader;