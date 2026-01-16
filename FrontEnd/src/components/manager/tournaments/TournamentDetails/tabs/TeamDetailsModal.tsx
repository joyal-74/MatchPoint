import { X, Shield, Calendar, User, Mail, Phone } from "lucide-react";
import type { RegisteredTeam } from "./TabContent";

interface TeamDetailsModalProps {
    team: RegisteredTeam | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
    if (!isOpen || !team) return null;

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    const stats = {
        matchesPlayed: 0,
        wins: 0,
        winRate: "0%"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* 1. Header Banner - Uses Primary Theme Color */}
                <div className="h-32 bg-gradient-to-r from-primary/90 via-primary/70 to-background relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 text-foreground/80 hover:text-foreground transition-all backdrop-blur-sm z-10"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. Identity Section (Overlapping) */}
                <div className="px-6 pb-6 -mt-12 flex flex-col items-center border-b border-border">
                    {/* Logo */}
                    <div className="relative w-24 h-24 rounded-full bg-card p-1.5 border border-border shadow-2xl">
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {team.logo ? (
                                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-muted-foreground">{getInitials(team.name)}</span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full border-4 border-card">
                            <Shield size={14} fill="currentColor" />
                        </div>
                    </div>

                    {/* Name & ID */}
                    <h2 className="text-2xl font-bold text-foreground mt-3 text-center">{team.name}</h2>
                    <span className="text-xs text-muted-foreground font-mono mt-1">ID: {team._id.slice(-6).toUpperCase()}</span>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-8 mt-6 w-full max-w-sm">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground">{stats.matchesPlayed}</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Matches</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-border px-8">
                            <span className="text-lg font-bold text-primary">{stats.wins}</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Wins</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground">{stats.winRate}</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Win Rate</span>
                        </div>
                    </div>
                </div>

                {/* 3. Details Content (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-card">
                    
                    {/* Key Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                <User size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Captain</p>
                                <p className="text-sm font-medium text-foreground truncate">{team.captain}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Registered</p>
                                <p className="text-sm font-medium text-foreground">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Contact info (Mocked visual - replace with real data if available) */}
                        <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                                <Mail size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Contact Email</p>
                                <p className="text-sm font-medium text-muted-foreground truncate opacity-70 italic">Hidden for privacy</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Phone</p>
                                <p className="text-sm font-medium text-muted-foreground opacity-70 italic">Hidden</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}