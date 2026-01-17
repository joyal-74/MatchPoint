import React from 'react';
import { X, MapPin, Users, Trophy, Calendar, Target, Shield, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import type { Team } from './Types';
import { useAppSelector } from '../../../hooks/hooks';

interface TeamModalProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, isOpen, onClose, onSubmit }) => {
    const { approvedTeams, pendingTeams } = useAppSelector(state => state.player);

    let status: 'joined' | 'pending' | 'none' = 'none';
    if (approvedTeams.some(t => t._id === team._id)) status = 'joined';
    else if (pendingTeams.some(t => t._id === team._id)) status = 'pending';

    if (!isOpen) return null;

    // Phase Configuration
    const getPhaseConfig = () => {
        switch(team.phase) {
            case 'recruiting': return { 
                badge: 'bg-blue-500 text-white', 
                gradient: 'from-blue-600/20 to-indigo-600/20',
                border: 'border-blue-500/20'
            };
            case 'active': return { 
                badge: 'bg-green-500 text-white', 
                gradient: 'from-green-600/20 to-emerald-600/20',
                border: 'border-green-500/20'
            };
            default: return { 
                badge: 'bg-zinc-500 text-white', 
                gradient: 'from-zinc-600/20 to-stone-600/20',
                border: 'border-zinc-500/20'
            };
        }
    };
    const phaseConfig = getPhaseConfig();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            
            {/* 1. Backdrop */}
            <div 
                className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300" 
                onClick={onClose}
            />

            {/* 2. Modal Container */}
            <div className="relative z-10 w-full max-w-xl bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
                
                {/* --- HEADER BANNER --- */}
                <div className={`relative h-32 bg-gradient-to-r ${phaseConfig.gradient} flex items-start justify-between p-4`}>
                    {/* Abstract Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    {/* Status Badge (Top Left) */}
                    <div className={`relative px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${phaseConfig.badge}`}>
                        {team.phase}
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="relative p-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground/80 hover:text-foreground transition-colors backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- FLOATING IDENTITY --- */}
                <div className="px-6 sm:px-8 -mt-10 mb-2 flex items-end justify-between relative z-20">
                    <div className="flex items-end gap-4">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-2xl bg-card p-1.5 shadow-xl border border-border">
                            <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                                {team.logo ? (
                                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Shield className="w-10 h-10 text-muted-foreground/30" />
                                )}
                            </div>
                        </div>
                        
                        {/* Title Block (Mobile: Moves below, Desktop: Stays side) */}
                        <div className="pb-1 hidden sm:block">
                            <h2 className="text-2xl font-bold text-foreground leading-none mb-1.5">{team.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <Trophy size={14} className="text-primary" /> {team.sport}
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <MapPin size={14} /> {team.city}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Title Block (Visible only on small screens) */}
                <div className="px-6 sm:hidden mb-6 mt-2">
                    <h2 className="text-2xl font-bold text-foreground leading-tight mb-1">{team.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy size={14} className="text-primary" /> {team.sport}
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <MapPin size={14} /> {team.city}
                    </div>
                </div>

                {/* --- BODY SCROLLABLE --- */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-2">
                    
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            About the Team
                        </h3>
                        <p className="text-sm text-muted-foreground/90 leading-relaxed">
                            {team.description || "This team hasn't added a description yet. Join them to find out more about their goals and playstyle."}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <StatBox 
                            icon={<Users size={16} />} 
                            label="Roster" 
                            value={`${team.membersCount} / ${team.maxPlayers}`} 
                            subtext={`${Math.round((team.membersCount/team.maxPlayers)*100)}% Full`}
                        />
                        <StatBox 
                            icon={<Trophy size={16} />} 
                            label="Win Rate" 
                            value={`${team.stats?.winRate || 0}%`} 
                            color="text-amber-500"
                        />
                        <StatBox 
                            icon={<Target size={16} />} 
                            label="Matches" 
                            value={team.stats?.totalMatches || 0} 
                            color="text-blue-500"
                        />
                        <StatBox 
                            icon={<Calendar size={16} />} 
                            label="Founded" 
                            value={new Date(team.createdAt).getFullYear()} 
                            color="text-purple-500"
                        />
                    </div>
                </div>

                {/* --- FOOTER ACTION --- */}
                <div className="p-6 border-t border-border bg-muted/5">
                    <button
                        onClick={onSubmit}
                        disabled={status !== 'none'}
                        className={`
                            group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm
                            ${status === 'joined'
                                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                                : status === 'pending'
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                            }
                        `}
                    >
                        {status === 'joined' && <CheckCircle2 size={18} />}
                        {status === 'pending' && <Clock size={18} />}
                        {status === 'none' && <span className="bg-white/20 p-1 rounded-full"><ArrowRight size={14} /></span>}
                        
                        <span className="tracking-wide">
                            {status === 'joined' ? 'Already a Member' : status === 'pending' ? 'Request Pending' : 'Send Join Request'}
                        </span>
                    </button>
                    {status === 'none' && (
                        <p className="text-center text-xs text-muted-foreground mt-3">
                            The team manager will review your request shortly.
                        </p>
                    )}
                </div>
            </div>
        </div> 
    );
};

// Helper Component for Stats
const StatBox = ({ icon, label, value, subtext, color = "text-foreground" }: any) => (
    <div className="bg-secondary/30 p-3 rounded-xl border border-border/50 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
        <div className={`p-2 bg-background rounded-lg shadow-sm ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1.5">
                <p className="text-sm font-bold text-foreground">{value}</p>
                {subtext && <span className="text-[10px] text-muted-foreground font-medium">{subtext}</span>}
            </div>
        </div>
    </div>
);

export default TeamModal;