import { Shield } from "lucide-react";


const TeamMemberCard = ({ member }: { member: any }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200 group">
            
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={member.profileImage || '/default-avatar.png'}
                    alt={member.firstName}
                    className="w-12 h-12 rounded-full object-cover border border-border bg-muted"
                />
                {/* Role Indicator (optional, logic needed) */}
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border text-primary">
                    <Shield size={10} fill="currentColor" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {member.firstName} {member.lastName}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                    {member.profile?.position || 'Team Member'}
                </p>
            </div>
        </div>
    );
};

export default TeamMemberCard;