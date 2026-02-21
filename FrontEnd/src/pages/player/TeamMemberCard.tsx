import { Shield } from "lucide-react";
import { useState } from "react";

const getInitials = (first = '', last = '') => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

const getBgColor = (name = '') => {
    const colors = [
        'bg-blue-500/20 text-blue-600',
        'bg-emerald-500/20 text-emerald-600',
        'bg-violet-500/20 text-violet-600',
        'bg-orange-500/20 text-orange-600',
        'bg-rose-500/20 text-rose-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
};

const TeamMemberCard = ({ member }: { member: any }) => {
    console.log(member)
    const [imgError, setImgError] = useState(false);

    // Logic for the fallback icon
    const initials = getInitials(member.firstName, member.lastName);
    const colorClass = getBgColor(`${member.firstName} ${member.lastName}`);

    return (
        <div className="group flex items-center gap-4 p-3 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">

            <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Conditional Rendering: Image vs Initials */}
                {member.profileImage && !imgError ? (
                    <img
                        src={member.profileImage}
                        className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm relative z-10"
                        alt=""
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={`w-12 h-12 rounded-full border-2 border-background shadow-sm relative z-10 flex items-center justify-center text-xs font-black tracking-tighter ${colorClass}`}>
                        {initials}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {member.firstName} {member.lastName}
                </h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">
                    {member.profile?.position || 'Team Member'}
                </p>
            </div>

            {/* Badge */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield size={14} className="text-primary/40" />
            </div>
        </div>
    );
};

export default TeamMemberCard;