import React from 'react';
import { MapPin, Users, ChevronRight, Trophy, Shield, TrendingUp, Clock } from 'lucide-react';
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
            case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    return (
        <div 
            onClick={() => onViewDetails(team)}
            className="group relative flex flex-col sm:flex-row sm:items-center p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Left Accent Bar on Hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* --- 1. Identity Section --- */}
            <div className="flex items-center gap-5 flex-1 min-w-0">
                
                {/* Logo */}
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                            <Shield className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
                        )}
                    </div>
                    {team.phase === 'recruiting' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-card animate-pulse" />
                    )}
                </div>

                {/* Info */}
                <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                            {team.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle()}`}>
                            {team.phase}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                            <Trophy size={14} className="text-primary" /> {team.sport}
                        </span>
                        <span className="hidden sm:inline-block text-border">|</span>
                        <span className="flex items-center gap-1.5 truncate">
                            <MapPin size={14} /> {team.city}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- 2. Stats Section (Hidden on very small screens, shown on tablet/desktop) --- */}
            <div className="hidden md:flex items-center gap-6 px-6 border-l border-border/50 mx-6">
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <Users size={12} /> Roster
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                        {team.membersCount} <span className="text-muted-foreground font-normal">/ {team.maxPlayers}</span>
                    </span>
                </div>

                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <TrendingUp size={12} /> Win Rate
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                        {team.stats?.winRate || 0}%
                    </span>
                </div>

                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <Clock size={12} /> Age
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                        {new Date().getFullYear() - new Date(team.createdAt).getFullYear() < 1 
                            ? "New" 
                            : `${new Date().getFullYear() - new Date(team.createdAt).getFullYear()}y`}
                    </span>
                </div>
            </div>

            {/* --- 3. Action Arrow --- */}
            <div className="flex items-center pl-4 sm:pl-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50 sm:border-none justify-end sm:justify-start w-full sm:w-auto">
                <span className="group-hover:bg-primary group-hover:text-primary-foreground p-2 rounded-full transition-colors duration-300">
                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-current transition-transform group-hover:translate-x-0.5" />
                </span>
            </div>
        </div>
    );
};

export default TeamListItem;