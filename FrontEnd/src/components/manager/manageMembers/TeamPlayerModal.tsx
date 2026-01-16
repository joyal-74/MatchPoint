import { X, Mail, Phone, Hash, Shield, User } from 'lucide-react';
import type { TeamPlayer } from '../../../types/Player';

interface TeamPlayerModalProps {
    player: TeamPlayer;
    isOpen: boolean;
    onClose: () => void;
}

const TeamPlayerModal = ({ player, isOpen, onClose }: TeamPlayerModalProps) => {
    if (!isOpen) return null;

    const getStatusBadge = (status: string, type: 'role' | 'approval') => {
        if (type === 'role') {
            return status === 'playing' 
                ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' 
                : 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400';
        }
        return status === 'approved'
            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400';
    };

    return (
        // 1. Parent Container (High Z-Index, Fixed to screen)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* 2. The Backdrop (Absolute, Layer 0) */}
            {/* We inline this to ensure it sits BEHIND the content */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* 3. The Modal Content (Relative, Layer 1) */}
            <div className="relative z-10 bg-background w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header Banner */}
                <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-background relative">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                    
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-md hover:bg-background text-muted-foreground hover:text-foreground rounded-full transition-all border border-transparent hover:border-border cursor-pointer z-20"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-8 relative">
                    
                    {/* Floating Avatar */}
                    <div className="-mt-14 mb-4 flex justify-between items-end">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-background p-1.5 shadow-xl ring-1 ring-border">
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                                    {player.profileImage ? (
                                        <img
                                            src={player.profileImage}
                                            alt={player.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-muted-foreground/50" />
                                    )}
                                </div>
                            </div>
                            {player.approvalStatus === 'approved' && (
                                <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-background shadow-sm" title="Approved Player">
                                    <Shield size={12} fill="currentColor" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                {player.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusBadge(player.status, 'role')}`}>
                                    {player.status}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusBadge(player.approvalStatus, 'approval')}`}>
                                    {player.approvalStatus}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-border w-full" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
                                <div className="p-2 bg-background rounded-lg text-primary shadow-sm">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Position</p>
                                    <p className="text-sm font-semibold text-foreground">{player.position || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
                                <div className="p-2 bg-background rounded-lg text-primary shadow-sm">
                                    <Hash size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Jersey No</p>
                                    <p className="text-sm font-semibold text-foreground">{player.jerseyNumber || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {(player.email || player.phone) && (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    Contact Details
                                </h3>
                                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                                    {player.email && (
                                        <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                                            <Mail size={16} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground">{player.email}</span>
                                        </div>
                                    )}
                                    {player.phone && (
                                        <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                                            <Phone size={16} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground">{player.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPlayerModal;