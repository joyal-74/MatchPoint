import React from 'react';
import { X, MapPin, Users, Trophy, Calendar, Target, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
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

    // Phase Color Logic
    const getPhaseColor = () => {
        switch(team.phase) {
            case 'recruiting': return 'bg-blue-500';
            case 'active': return 'bg-green-500';
            default: return 'bg-muted-foreground';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header Accent Line */}
                <div className={`h-1.5 w-full ${getPhaseColor()}`} />

                {/* Header Section */}
                <div className="px-6 pt-6 pb-4 border-b border-border flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                                {team.logo ? (
                                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Shield className="w-8 h-8 text-muted-foreground/50" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground leading-tight mb-1">{team.name}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-semibold border border-primary/20 flex items-center gap-1">
                                    <Trophy size={10} /> {team.sport}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border capitalize ${
                                    team.phase === 'recruiting' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                                    team.phase === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                                    'bg-muted text-muted-foreground border-border'
                                }`}>
                                    {team.phase}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content (Scrollable) */}
                <div className="p-6 overflow-y-auto">
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin size={16} className="text-primary" />
                        <span>{team.city}, {team.state}</span>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-2">About the Team</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {team.description || "No description provided."}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg shadow-sm text-blue-500">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Roster</p>
                                <p className="text-sm font-bold text-foreground">
                                    {team.membersCount} / {team.maxPlayers}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg shadow-sm text-amber-500">
                                <Trophy size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Win Rate</p>
                                <p className="text-sm font-bold text-foreground">
                                    {team.stats?.winRate || 0}%
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg shadow-sm text-red-500">
                                <Target size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Matches</p>
                                <p className="text-sm font-bold text-foreground">
                                    {team.stats?.totalMatches || 0}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg shadow-sm text-purple-500">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Created</p>
                                <p className="text-sm font-bold text-foreground">
                                    {new Date(team.createdAt).getFullYear()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="space-y-1.5 mb-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Team Capacity</span>
                            <span className="text-foreground font-bold">{Math.round((team.membersCount / team.maxPlayers) * 100)}% Full</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${Math.min((team.membersCount / team.maxPlayers) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-border bg-muted/10">
                    <button
                        onClick={onSubmit}
                        disabled={status !== 'none'}
                        className={`
                            w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-sm
                            ${status === 'joined'
                                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                                : status === 'pending'
                                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                            }
                        `}
                    >
                        {status === 'joined' && <CheckCircle2 size={18} />}
                        {status === 'pending' && <AlertCircle size={18} />}
                        {status === 'joined' ? 'Already Joined' : status === 'pending' ? 'Request Pending' : 'Join Team'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;