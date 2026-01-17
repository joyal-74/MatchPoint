import React from 'react';
import { MapPin, Trophy, Users, TrendingUp, ChevronRight, Shield } from 'lucide-react';
import type { Team } from './Types';

interface TeamCardProps {
    team: Team;
    onViewDetails: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onViewDetails }) => {
    return (
        <div 
            onClick={() => onViewDetails(team)}
            className="group relative flex flex-col h-full bg-card rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 overflow-hidden cursor-pointer"
        >
            {/* --- 1. Top Visual Area --- */}
            <div className="relative h-32 bg-secondary/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <div className="absolute w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        team.phase === 'recruiting' 
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    }`}>
                        {team.phase === 'recruiting' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5" />}
                        {team.phase}
                    </span>
                </div>

                {/* The Logo */}
                <div className="relative z-10 w-16 h-16 bg-card rounded-2xl p-1 shadow-lg border border-border/50 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                            <Shield className="w-8 h-8 text-muted-foreground/30" strokeWidth={1.5} />
                        )}
                    </div>
                </div>
            </div>

            {/* --- 2. Content Body --- */}
            <div className="p-5 flex-1 flex flex-col text-center">
                {/* Team Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                        {team.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-md">
                            <Trophy size={10} /> {team.sport}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={10} /> {team.city}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 mb-4">
                    {team.description || "Building a legacy. Join us to compete at the highest level."}
                </p>

                {/* Divider */}
                <div className="mt-auto pt-4 w-full border-t border-border/50 flex items-center justify-between px-2">
                    {/* Stat 1: Roster */}
                    <div className="text-left">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                            <Users size={10} /> Roster
                        </div>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {team.membersCount} <span className="text-muted-foreground font-normal">/ {team.maxPlayers}</span>
                        </div>
                    </div>

                    {/* Stat 2: Win Rate */}
                    <div className="text-right">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5 flex items-center justify-end gap-1">
                            <TrendingUp size={10} /> Win Rate
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            {team.stats?.winRate || 0}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-10 bg-secondary/30 border-t border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <span className="text-xs font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    View Team Profile <ChevronRight size={14} />
                </span>
            </div>
        </div>
    );
};

export default TeamCard;