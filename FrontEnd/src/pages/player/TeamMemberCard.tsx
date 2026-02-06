import { Shield } from "lucide-react";

const TeamMemberCard = ({ member }: { member: any }) => (
    <div className="group flex items-center gap-4 p-3 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        {/* Profile Image with Ring */}
        <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
                src={member.profileImage || '/default-avatar.png'}
                className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm relative z-10"
                alt=""
            />
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

export default TeamMemberCard;