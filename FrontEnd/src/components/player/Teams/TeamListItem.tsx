import { MapPin, Users, ChevronRight, Trophy, Shield } from 'lucide-react';
import type { Team } from './Types';

interface TeamListItemProps {
    team: Team;
    onViewDetails: (team: Team) => void;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ team, onViewDetails }) => {
    
    // Status Badge Logic
    const getStatusStyle = () => {
        switch (team.phase) {
            case 'recruiting': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="group p-5 bg-card border-b border-border last:border-b-0 hover:bg-muted/30 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left Side: Logo & Info */}
                <div className="flex items-start gap-4 flex-1">
                    {/* Logo */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {team.logo ? (
                                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield className="w-7 h-7 text-muted-foreground/50" />
                            )}
                        </div>
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                                {team.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusStyle()}`}>
                                {team.phase}
                            </span>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Trophy size={14} className="text-primary/70" />
                                <span>{team.sport}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-primary/70" />
                                <span className="truncate max-w-[150px]">{team.city}, {team.state}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={14} className="text-primary/70" />
                                <span>{team.membersCount || 0} / {team.maxPlayers}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Stats & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                    <div className="text-right">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Win Rate</div>
                        <div className="font-bold text-lg text-foreground">{team.stats?.winRate || 0}%</div>
                    </div>

                    <button
                        onClick={() => onViewDetails(team)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-all shadow-sm group-hover:translate-x-1"
                    >
                        View
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamListItem;