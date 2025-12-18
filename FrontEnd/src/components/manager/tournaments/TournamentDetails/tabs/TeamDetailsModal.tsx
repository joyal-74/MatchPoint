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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* 1. Header Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-900 via-neutral-800 to-neutral-900 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all backdrop-blur-sm z-10"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. Identity Section (Overlapping) */}
                <div className="px-6 pb-6 -mt-12 flex flex-col items-center border-b border-white/5">
                    {/* Logo */}
                    <div className="relative w-24 h-24 rounded-full bg-neutral-900 p-1.5 border border-white/10 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                            {team.logo ? (
                                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-neutral-400">{getInitials(team.name)}</span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-4 border-neutral-900">
                            <Shield size={14} fill="currentColor" />
                        </div>
                    </div>

                    {/* Name & ID */}
                    <h2 className="text-2xl font-bold text-white mt-3 text-center">{team.name}</h2>
                    <span className="text-xs text-neutral-500 font-mono mt-1">ID: {team._id.slice(-6).toUpperCase()}</span>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-8 mt-6 w-full max-w-sm">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-white">{stats.matchesPlayed}</span>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Matches</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-white/5 px-8">
                            <span className="text-lg font-bold text-emerald-400">{stats.wins}</span>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Wins</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-white">{stats.winRate}</span>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Win Rate</span>
                        </div>
                    </div>
                </div>

                {/* 3. Details Content (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    
                    {/* Key Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-neutral-800/30 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <User size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Captain</p>
                                <p className="text-sm font-medium text-white truncate">{team.captain}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-neutral-800/30 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Registered</p>
                                <p className="text-sm font-medium text-white">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Contact info (Mocked visual - replace with real data if available) */}
                        <div className="p-3 rounded-xl bg-neutral-800/30 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Mail size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Contact Email</p>
                                <p className="text-sm font-medium text-white truncate opacity-50 italic">Hidden for privacy</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-neutral-800/30 border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Phone</p>
                                <p className="text-sm font-medium text-white opacity-50 italic">Hidden</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}