import { X, Mail, Phone, Activity, User, Shield } from 'lucide-react';
import ModalBackdrop from '../../../ui/ModalBackdrop';
import type { PlayerDetails } from '../Types';

interface PlayerDetailsModalProps {
    player: PlayerDetails;
    isOpen: boolean;
    onClose: () => void;
}

const PlayerDetailsModal = ({ player, isOpen, onClose }: PlayerDetailsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />
            
            {/* Modal Container */}
            <div className="bg-card text-card-foreground border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">
                
                {/* Header - Sticky */}
                <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card/95 backdrop-blur-sm z-10">
                    <h2 className="text-xl font-bold text-foreground">Player Details</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    
                    {/* Player Info Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shadow-sm">
                                {player.profileImage ? (
                                    <img src={player.profileImage} alt={player.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-muted-foreground">
                                        {player.firstName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {/* Role Badge Icon (Optional decoration) */}
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                                <Shield size={14} />
                            </div>
                        </div>

                        {/* Name and Contacts */}
                        <div className="text-center sm:text-left flex-1 space-y-2">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">
                                    {player.firstName} {player.lastName}
                                </h3>
                                <p className="text-primary font-medium">{player.profile?.position || 'Unknown Position'}</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-sm text-muted-foreground">
                                {player.email && (
                                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                        <Mail size={14} />
                                        <span>{player.email}</span>
                                    </div>
                                )}
                                {player.phone && (
                                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                        <Phone size={14} />
                                        <span>{player.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Batting Stats Card */}
                        <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 border-b border-border pb-2">
                                <Activity size={18} className="text-primary" />
                                <h4 className="font-semibold text-foreground">Batting Stats</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Matches</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.batting?.matches || '-'}</div>
                                
                                <div className="text-muted-foreground">Runs</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.batting?.runs || '-'}</div>
                                
                                <div className="text-muted-foreground">Average</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.batting?.average || '-'}</div>
                                
                                <div className="text-muted-foreground">Strike Rate</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.batting?.strikeRate || '-'}</div>
                            </div>
                        </div>

                        {/* Bowling Stats Card */}
                        <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 border-b border-border pb-2">
                                <Activity size={18} className="text-primary" />
                                <h4 className="font-semibold text-foreground">Bowling Stats</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Matches</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.bowling?.matches || '-'}</div>
                                
                                <div className="text-muted-foreground">Wickets</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.bowling?.wickets || '-'}</div>
                                
                                <div className="text-muted-foreground">Economy</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.bowling?.economy || '-'}</div>
                                
                                <div className="text-muted-foreground">Average</div>
                                <div className="text-right font-medium text-foreground">{player.stats?.bowling?.average || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <User size={18} className="text-primary" />
                            Profile Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Preferred Role</p>
                                <p className="text-sm text-foreground">{player.profile?.position || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Batting Style</p>
                                <p className="text-sm text-foreground">{player.profile?.battingStyle || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Bowling Style</p>
                                <p className="text-sm text-foreground">{player.profile?.bowlingStyle || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;