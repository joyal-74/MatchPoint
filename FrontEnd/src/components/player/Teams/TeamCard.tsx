import React from 'react';
import { MapPin, Eye, Trophy, Users, BarChart3, Shield } from 'lucide-react';
import type { Team } from './Types';

interface TeamCardProps {
    team: Team;
    onViewDetails: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onViewDetails }) => {
    
    // Status Badge Logic
    const getStatusStyle = () => {
        switch (team.phase) {
            case 'recruiting': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col h-full">
            
            {/* Top Accent Bar */}
            <div className={`h-1.5 w-full ${team.phase === 'recruiting' ? 'bg-blue-500' : team.phase === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`} />

            <div className="p-5 flex flex-col flex-1">
                
                {/* Header: Logo & Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {team.logo ? (
                                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield className="w-6 h-6 text-muted-foreground/50" />
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                            {team.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <MapPin size={12} />
                            <span className="truncate">{team.city}, {team.state}</span>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                        <Trophy size={10} /> {team.sport}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusStyle()}`}>
                        {team.phase}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {team.description || "No description provided."}
                </p>

                {/* Stats & Progress */}
                <div className="space-y-4 pt-4 border-t border-border mt-auto">
                    
                    {/* Member Progress */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Users size={12} /> Roster
                            </span>
                            <span className="font-medium text-foreground">
                                {team.membersCount} / {team.maxPlayers}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min((team.membersCount / team.maxPlayers) * 100, 100)}%` }} 
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-muted rounded-lg text-muted-foreground">
                                <BarChart3 size={14} />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold">Win Rate</div>
                                <div className="text-sm font-bold text-foreground">{team.stats?.winRate || 0}%</div>
                            </div>
                        </div>

                        <button
                            onClick={() => onViewDetails(team)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            <Eye size={14} />
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;