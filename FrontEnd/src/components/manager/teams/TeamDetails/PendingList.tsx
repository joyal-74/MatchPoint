import { Eye, Check, X, User, Clock } from 'lucide-react';
import type { PlayerDetails } from '../Types';

const PendingList = ({
    players,
    openPlayerDetails,
    openApprovalModal,
}: {
    players: PlayerDetails[];
    openPlayerDetails: (player: PlayerDetails) => void;
    openApprovalModal: (player: PlayerDetails) => void;
}) => {
    
    if (players.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Check className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">All caught up! No pending requests.</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {players.map((player) => (
                <div
                    key={player.playerId}
                    className="
                        group flex flex-col sm:flex-row sm:items-center justify-between 
                        p-4 rounded-xl border border-border bg-card 
                        hover:border-primary/40 hover:shadow-sm 
                        transition-all duration-200
                    "
                >
                    {/* Left Side: Identity */}
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                                {player.profileImage ? (
                                    <img src={player.profileImage} alt={player.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5 shadow-sm">
                                <Clock size={8} strokeWidth={4} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground text-sm">
                                {player.firstName} {player.lastName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{player.profile?.position || 'Applicant'}</span>
                                <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
                                <span>Requested today</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Actions Toolbar */}
                    <div className="flex items-center justify-end gap-2 pl-4 border-l border-transparent sm:border-border">
                        <button
                            onClick={() => openPlayerDetails(player)}
                            className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <Eye size={14} /> View
                        </button>
                        
                        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
                            <button
                                onClick={() => openApprovalModal(player)}
                                className="p-1.5 rounded-md text-destructive hover:bg-background hover:shadow-sm transition-all"
                                title="Reject"
                            >
                                <X size={16} />
                            </button>
                            <div className="w-px h-4 bg-border"></div>
                            <button
                                onClick={() => openApprovalModal(player)}
                                className="p-1.5 rounded-md text-primary hover:bg-background hover:shadow-sm transition-all"
                                title="Approve"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PendingList;