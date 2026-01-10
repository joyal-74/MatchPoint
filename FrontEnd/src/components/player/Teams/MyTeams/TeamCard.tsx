import { useNavigate } from "react-router-dom";
import { Users, Calendar, Trophy, ArrowRight, Shield } from "lucide-react";
import TeamMenu from "./TeamMenu"; // Assuming this handles the dropdown logic

export interface TeamCardProps {
    _id: string;
    name: string;
    sport: string;
    membersCount: number;
    created: string;
    maxPlayers: string;
    managerId: string;
    logo?: string;
    index: number;
    className?: string;
    onLeaveRequest: (teamId: string) => void;
}

export default function TeamCard({
    _id,
    name,
    sport,
    membersCount,
    created,
    logo,
    maxPlayers,
    onLeaveRequest,
    className = ""
}: TeamCardProps) {
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/player/myteam/${_id}`);
    };

    return (
        <div className={`group relative bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col h-full ${className}`}>
            
            {/* Header: Logo, Name, Menu */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {/* Logo Area */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {logo ? (
                                <img src={logo} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield className="w-7 h-7 text-muted-foreground/50" />
                            )}
                        </div>
                        {/* Sport Badge (Overlapping) */}
                        <div className="absolute -bottom-2 -right-2 bg-background border border-border rounded-full p-1 shadow-sm">
                            <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center">
                                <Trophy size={10} fill="currentColor" />
                            </div>
                        </div>
                    </div>

                    {/* Title Area */}
                    <div className="pt-1">
                        <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                            {sport}
                        </p>
                    </div>
                </div>

                {/* Actions Menu */}
                <div className="relative z-10">
                    <TeamMenu 
                        teamId={_id} 
                        onLeaveRequest={onLeaveRequest} 
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 my-4" />

            {/* Stats Grid */}
            <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={16} className="text-primary/70" />
                        <span>Roster</span>
                    </div>
                    <span className="font-semibold text-foreground">
                        {membersCount} <span className="text-muted-foreground font-normal">/ {maxPlayers}</span>
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} className="text-primary/70" />
                        <span>Created</span>
                    </div>
                    <span className="font-medium text-foreground">
                        {new Date(created).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Footer Action */}
            <button
                onClick={handleView}
                className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold transition-all group-hover:bg-primary group-hover:text-primary-foreground"
            >
                View Team
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
}