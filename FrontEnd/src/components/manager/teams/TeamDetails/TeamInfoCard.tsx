import { MapPin, Users, Target, Trophy, Activity, Swords } from 'lucide-react';
import type { Team } from '../Types';

const TeamInfoCard = ({ team }: { team: Team }) => {
    
    // Helper for semantic badge styling
    const getStatusStyles = (phase: string) => {
        switch (phase) {
            case 'recruiting':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'active':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden h-full flex flex-col">
            
            {/* 1. decorative Cover Banner */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-background relative overflow-hidden">
                {/* Abstract decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* 2. Profile Header Section */}
            <div className="px-6 relative flex flex-col items-center text-center -mt-12">
                {/* Logo with Elevation */}
                <div className="relative mb-3 group">
                    <div className="w-24 h-24 rounded-full p-1 bg-card ring-1 ring-border shadow-xl">
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {/* Floating Trophy Icon */}
                    <div className="absolute bottom-0 right-0 bg-card p-1.5 rounded-full border border-border shadow-sm text-primary">
                        <Trophy size={14} fill="currentColor" className="opacity-20 text-foreground" />
                        <Trophy size={14} className="absolute inset-0 m-auto" />
                    </div>
                </div>

                {/* Name & Location */}
                <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                    {team.name}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <MapPin size={14} />
                    <span>{team.city}, {team.state}</span>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-primary/20">
                        {team.sport}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusStyles(team.phase)}`}>
                        {team.phase}
                    </span>
                </div>
            </div>

            {/* 3. Description & Stats */}
            <div className="px-6 pb-6 flex-1 flex flex-col gap-6">
                
                {/* Description */}
                <div className="text-sm text-muted-foreground text-center leading-relaxed">
                    "{team.description}"
                </div>

                {/* Clean Divided Stats Row */}
                <div className="grid grid-cols-3 border-y border-border py-4 bg-muted/20 rounded-lg">
                    <div className="flex flex-col items-center justify-center border-r border-border/60">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-medium mb-1">
                            <Users size={14} /> Members
                        </span>
                        <span className="text-lg font-bold text-foreground">{team.membersCount}</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center border-r border-border/60">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-medium mb-1">
                            <Target size={14} /> Capacity
                        </span>
                        <span className="text-lg font-bold text-foreground">{team.maxPlayers}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-medium mb-1">
                            <Swords size={14} /> Matches
                        </span>
                        <span className="text-lg font-bold text-foreground">{team.stats.totalMatches}</span>
                    </div>
                </div>

                {/* Hero Metric: Win Rate */}
                <div className="mt-auto bg-primary/5 rounded-xl p-4 border border-primary/10 relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-2 relative z-10">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Activity size={18} />
                            <span>Win Rate</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">{team.stats.winRate}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-background rounded-full h-2.5 overflow-hidden border border-border/50 relative z-10">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${team.stats.winRate}%` }}
                        />
                    </div>

                    {/* Subtle Background Pattern for Visual Interest */}
                    <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-primary/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>
        </div>
    );
};

export default TeamInfoCard;