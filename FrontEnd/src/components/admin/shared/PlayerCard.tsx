import type { AdminTeamMember } from "../../../features/admin/tournament/tournamentTypes";

export const PlayerCard = ({ member }: { member: AdminTeamMember }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between hover:bg-accent hover:border-accent transition-all group shadow-sm">
            <div className="flex items-center gap-3">
                <img
                    src={member.profileImage || 'https://via.placeholder.com/40'}
                    alt={member.firstName}
                    className="w-10 h-10 rounded-full bg-muted object-cover border border-border"
                />
                <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        {member.firstName} {member.lastName}
                        {member.role === 'Captain' && <span className="text-[10px] bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-1 rounded border border-yellow-500/30">C</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {member.profile?.role} • {member.status}
                    </p>
                </div>
            </div>
        </div>
    )
};